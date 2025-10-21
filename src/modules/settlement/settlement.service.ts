import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
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

  async createSettlement(createSettlementDto: CreateSettlementDto) {
    const loan = await this.loanRepository.findById(createSettlementDto.loanId);
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${createSettlementDto.loanId} not found`);
    }

    // Check if a settlement already exists for this loan
    const existingSettlement = await this.settlementRepository.findByLoanId(createSettlementDto.loanId);
    if (existingSettlement) {
      throw new ConflictException(`A settlement already exists for loan ID ${createSettlementDto.loanId}`);
    }

    const settlement = await this.settlementRepository.create({
      ...createSettlementDto,
    });

    this.notificationService.notifySettlementSubmitted(settlement);

    // Fetch settlement with relations to return complete data
    return this.settlementRepository.findByIdWithRelations(settlement.id);
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

    await this.settlementRepository.update(settlementId, { status });

    if (status === SettlementStatus.CONFIRMED) {
      const totalSettled = await this.settlementRepository.getTotalSettledAmount(loan.id);
      if (totalSettled >= loan.amount) {
        await this.loanRepository.update(loan.id, { status: LoanStatus.SETTLED });
      }
    }

    // Fetch settlement with relations to return complete data
    const updatedSettlement = await this.settlementRepository.findByIdWithRelations(settlementId);

    this.notificationService.notifySettlementConfirmed(updatedSettlement);

    return updatedSettlement;
  }

  async findSettlementForLoan(loanId: string) {
    return this.settlementRepository.findByLoanId(loanId);
  }
}
