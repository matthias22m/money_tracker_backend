import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from '../entities/group-member.entity';
import { IGroupMemberRepository } from '../interfaces/group.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class GroupMemberRepository extends BaseRepository<GroupMember> implements IGroupMemberRepository {
  constructor(
    @InjectRepository(GroupMember)
    protected readonly repository: Repository<GroupMember>,
  ) {
    super(repository);
  }

  async findByGroupId(groupId: string): Promise<GroupMember[]> {
    return this.repository.find({
      where: { groupId },
      relations: ['member'],
      order: { memberId: 'ASC' }, // Deterministic ordering for remainder distribution
    });
  }

  async findByGroupIdAndMemberId(groupId: string, memberId: string): Promise<GroupMember | null> {
    return this.repository.findOne({
      where: { groupId, memberId },
    });
  }

  async deleteByGroupIdAndMemberId(groupId: string, memberId: string): Promise<boolean> {
    const result = await this.repository.delete({ groupId, memberId });
    return result.affected > 0;
  }
}
