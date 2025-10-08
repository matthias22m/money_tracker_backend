import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { LoanRepository } from '../loan/repositories/loan.repository';
import { NotificationService } from '../notification/notification.service';
import { CreateSettlementDto } from '../loan/dto/create-settlement.dto';
import { SettlementStatus } from '../../common/enums/settlement-status.enum';
import { LoanStatus } from '../../common/enums/loan-status.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { SettlementRepository } from './repositories/settlement.repository';

@Injectable()
export class SettlementService {
  constructor(
    private readonly settlementRepository: SettlementRepository,
    private readonly loanRepository: LoanRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async createSettlement(loanId: string, createSettlementDto: CreateSettlementDto) {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${loanId} not found`);
    }

    const settlement = await this.settlementRepository.create({
      loanId,
      ...createSettlementDto,
    });

    this.notificationService.create({
      userId: loan.lenderId,
      type: NotificationType.SETTLEMENT_PENDING,
      message: `A settlement of ${settlement.amount} was submitted for your loan.`,
      settlementId: settlement.id,
    });

    return settlement;
  }

  async confirmOrRejectSettlement(settlementId: string, userId: string, status: SettlementStatus.CONFIRMED | SettlementStatus.REJECTED) {
    const settlement = await this.settlementRepository.findById(settlementId);
    if (!settlement) {
      throw new NotFoundException(`Settlement with ID ${settlementId} not found`);
    }

    const loan = await this.loanRepository.findById(settlement.loanId);
    if (loan.lenderId !== userId) {
      throw new ForbiddenException('Only the lender can confirm or reject a settlement.');
    }

    const updatedSettlement = await this.settlementRepository.update(settlementId, { status });

    if (status === SettlementStatus.CONFIRMED) {
      const totalSettled = await this.settlementRepository.getTotalSettledAmount(loan.id);
      if (totalSettled >= loan.amount) {
        await this.loanRepository.update(loan.id, { status: LoanStatus.SETTLED });
      }
    }

    this.notificationService.create({
      userId: settlement.payerId,
      type: NotificationType.SETTLEMENT_CONFIRMED,
      message: `Your settlement of ${settlement.amount} has been ${status}.`,
      settlementId: settlement.id,
    });

    return updatedSettlement;
  }

  async findSettlementsForLoan(loanId: string) {
    return this.settlementRepository.findAllByLoanId(loanId);
  }
}
