import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GroupRepository } from './repositories/group.repository';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { GroupExpenseRepository } from './repositories/group-expense.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { NotificationService } from '../notification/notification.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddGroupMembersDto } from './dto/add-group-members.dto';
import { CreateGroupExpenseDto } from './dto/create-group-expense.dto';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { GroupExpense } from './entities/group-expense.entity';
import { Loan } from '../loan/entities/loan.entity';
import { LoanStatus } from '../../common/enums/loan-status.enum';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly groupExpenseRepository: GroupExpenseRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  async createGroup(ownerId: string, createGroupDto: CreateGroupDto): Promise<Group> {
    const { name, description, members } = createGroupDto;

    // Check for duplicate group name for this owner
    const existingGroup = await this.groupRepository.findByOwnerIdAndName(ownerId, name);
    if (existingGroup) {
      throw new ConflictException(`You already have a group named "${name}"`);
    }

    // Normalize members: remove duplicates and owner
    const uniqueMemberIds = members
      ? Array.from(new Set(members)).filter((id) => id !== ownerId)
      : [];

    // Validate owner is not in members list
    if (members && members.includes(ownerId)) {
      throw new BadRequestException('You cannot add yourself as a member');
    }

    // Validate all members exist
    if (uniqueMemberIds.length > 0) {
      for (const memberId of uniqueMemberIds) {
        const user = await this.usersRepository.findById(memberId);
        if (!user) {
          throw new NotFoundException(`User with ID ${memberId} not found`);
        }
      }
    }

    // Create group
    const group = await this.groupRepository.create({
      ownerId,
      name,
      description,
    });

    // Add members
    if (uniqueMemberIds.length > 0) {
      for (const memberId of uniqueMemberIds) {
        await this.groupMemberRepository.create({
          groupId: group.id,
          memberId,
        });
      }
    }

    // Return group with members
    return this.groupRepository.findById(group.id);
  }

  async findAllByOwner(ownerId: string): Promise<Group[]> {
    return this.groupRepository.findByOwnerId(ownerId);
  }

  async findById(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Verify ownership
    if (group.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this group');
    }

    return group;
  }

  async addMembers(
    groupId: string,
    userId: string,
    addGroupMembersDto: AddGroupMembersDto,
  ): Promise<Group> {
    const group = await this.findById(groupId, userId);

    const { members } = addGroupMembersDto;

    // Normalize members: remove duplicates and owner
    const uniqueMemberIds = Array.from(new Set(members)).filter((id) => id !== userId);

    // Validate owner is not in members list
    if (members.includes(userId)) {
      throw new BadRequestException('You cannot add yourself as a member');
    }

    // Validate all members exist and add if not already in group
    for (const memberId of uniqueMemberIds) {
      const user = await this.usersRepository.findById(memberId);
      if (!user) {
        throw new NotFoundException(`User with ID ${memberId} not found`);
      }

      // Check if member already exists (idempotent behavior)
      const existingMember = await this.groupMemberRepository.findByGroupIdAndMemberId(
        groupId,
        memberId,
      );
      if (!existingMember) {
        await this.groupMemberRepository.create({
          groupId,
          memberId,
        });
      }
    }

    // Return updated group
    return this.groupRepository.findById(groupId);
  }

  async removeMember(groupId: string, memberId: string, userId: string): Promise<Group> {
    const group = await this.findById(groupId, userId);

    // Check if member exists in group
    const member = await this.groupMemberRepository.findByGroupIdAndMemberId(groupId, memberId);
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found in this group`);
    }

    // Remove member
    await this.groupMemberRepository.deleteByGroupIdAndMemberId(groupId, memberId);

    // Return updated group
    return this.groupRepository.findById(groupId);
  }

  async deleteGroup(groupId: string, userId: string): Promise<void> {
    const group = await this.findById(groupId, userId);

    // Delete group (cascade will delete members)
    const deleted = await this.groupRepository.delete(groupId);
    if (!deleted) {
      throw new InternalServerErrorException('Failed to delete group');
    }
  }

  async createGroupExpense(
    groupId: string,
    userId: string,
    createGroupExpenseDto: CreateGroupExpenseDto,
  ): Promise<{ groupExpenseId: string; loanIds: string[]; totalAmount: number; participantsCount: number }> {
    const { amount, description, date } = createGroupExpenseDto;

    // Validate group exists and user is owner
    const group = await this.findById(groupId, userId);

    // Load group members
    const groupMembers = await this.groupMemberRepository.findByGroupId(groupId);

    // Validate at least one member exists
    if (groupMembers.length === 0) {
      throw new BadRequestException('Cannot split expense with zero members. Add members to the group first.');
    }

    // Compute participants
    const participantsCount = groupMembers.length + 1; // owner + members

    // Split amount using integer cents to avoid floating point errors
    const { memberShares } = this.splitAmountEqually(amount, groupMembers.length);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createdLoanIds: string[] = [];
    let groupExpenseId: string;

    try {
      // Create group expense audit record
      const groupExpense = queryRunner.manager.create(GroupExpense, {
        groupId,
        ownerId: userId,
        description,
        amount,
        createdAt: date ? new Date(date) : new Date(),
      });
      const savedGroupExpense = await queryRunner.manager.save(groupExpense);
      groupExpenseId = savedGroupExpense.id;

      // Create loan for each member
      for (let i = 0; i < groupMembers.length; i++) {
        const member = groupMembers[i];
        const share = memberShares[i];

        const loan = queryRunner.manager.create(Loan, {
          lenderId: userId,
          borrowerId: member.memberId,
          amount: share,
          description: `Group: ${group.name}${description ? ` — ${description}` : ''}`,
          status: LoanStatus.ACTIVE,
          createdAt: date ? new Date(date) : new Date(),
        });

        const savedLoan = await queryRunner.manager.save(loan);
        createdLoanIds.push(savedLoan.id);
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      // After successful commit, send notifications (outside transaction)
      await this.sendLoanNotifications(createdLoanIds, group.name, userId);

      return {
        groupExpenseId,
        loanIds: createdLoanIds,
        totalAmount: amount,
        participantsCount,
      };
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create group expense: ${error.message}`,
      );
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  /**
   * Split amount equally among members using integer cents math
   * to avoid floating point rounding issues
   */
  splitAmountEqually(
    amount: number,
    memberCount: number,
  ): { memberShares: number[] } {
    // Convert to cents
    const totalCents = Math.round(amount * 100);

    // Integer division
    const baseShareCents = Math.floor(totalCents / memberCount);
    let remainder = totalCents - baseShareCents * memberCount;

    const memberShares: number[] = [];

    // Distribute shares with remainder
    for (let i = 0; i < memberCount; i++) {
      let memberShareCents = baseShareCents;
      if (remainder > 0) {
        memberShareCents += 1;
        remainder -= 1;
      }
      // Convert back to decimal with 2 places
      memberShares.push(memberShareCents / 100);
    }

    return { memberShares };
  }

  /**
   * Send notifications for created loans
   */
  private async sendLoanNotifications(
    loanIds: string[],
    groupName: string,
    ownerId: string,
  ): Promise<void> {
    const owner = await this.usersRepository.findById(ownerId);
    const ownerName = owner?.name || 'Someone';

    for (const loanId of loanIds) {
      const loan = await this.loanRepository.findOne({
        where: { id: loanId },
        relations: ['lender', 'borrower'],
      });

      if (loan) {
        // Send notification via existing notification service
        await this.notificationService.notifyLoanCreated(loan);
      }
    }
  }
}
