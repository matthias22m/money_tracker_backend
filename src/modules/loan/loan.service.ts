import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LoanRepository } from './repositories/loan.repository';
import { SettlementRepository } from './repositories/settlement.repository';
import { FriendsRepository } from '../friends/repositories/friends.repository';
import { NotificationService } from '../notification/notification.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { LoanStatus } from '../../common/enums/loan-status.enum';

@Injectable()
export class LoanService {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly settlementRepository: SettlementRepository,
    private readonly friendsRepository: FriendsRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async createLoan(lenderId: string, createLoanDto: CreateLoanDto) {
    const { borrowerId, amount, description } = createLoanDto;

    if (lenderId === borrowerId) {
      throw new BadRequestException('Lender and borrower cannot be the same person.');
    }

    const areFriends = await this.friendsRepository.findFriendship(lenderId, borrowerId);
    if (!areFriends) {
      throw new BadRequestException('You can only create loans with your friends.');
    }

    const loan = await this.loanRepository.create({
      lenderId,
      borrowerId,
      amount,
      description,
      status: LoanStatus.ACTIVE,
    });

    this.notificationService.create({
      userId: borrowerId,
      type: 'loan_created' as any,
      message: `A loan of ${amount} was logged by a friend in your name.`,
      loanId: loan.id,
    });

    return loan;
  }

  async findLoans(userId: string, filters?: any) {
    return this.loanRepository.findAllByUserId(userId, filters);
  }

  async addSettlement(loanId: string, createSettlementDto: CreateSettlementDto) {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${loanId} not found`);
    }

    const settlement = await this.settlementRepository.create({
      loanId,
      ...createSettlementDto,
    });

    this.notificationService.create({
      userId: createSettlementDto.receiverId,
      type: 'settlement_pending' as any,
      message: `A settlement of ${createSettlementDto.amount} is pending confirmation.`,
      settlementId: settlement.id,
    });

    return settlement;
  }

  async confirmSettlement(settlementId: string, userId: string) {
    const settlement = await this.settlementRepository.findById(settlementId);
    if (!settlement || settlement.receiverId !== userId) {
      throw new NotFoundException('Settlement not found or you are not the receiver.');
    }

    const updatedSettlement = await this.settlementRepository.update(settlementId, { status: 'confirmed' as any });

    const totalSettled = await this.settlementRepository.getTotalSettledAmount(settlement.loanId);
    const loan = await this.loanRepository.findById(settlement.loanId);

    if (totalSettled >= loan.amount) {
      await this.loanRepository.update(loan.id, { status: LoanStatus.SETTLED });
    }

    this.notificationService.create({
      userId: settlement.payerId,
      type: 'settlement_confirmed' as any,
      message: `Your settlement of ${settlement.amount} has been confirmed.`,
      settlementId: settlement.id,
    });
    this.notificationService.create({
      userId: settlement.receiverId,
      type: 'settlement_confirmed' as any,
      message: `You have confirmed a settlement of ${settlement.amount}.`,
      settlementId: settlement.id,
    });

    return updatedSettlement;
  }
}
