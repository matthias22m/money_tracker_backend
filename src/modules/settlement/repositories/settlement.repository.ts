import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settlement } from '../entities/settlement.entity';
import { ISettlementRepository } from '../interfaces/settlement.interface';
import { BaseRepository } from '../../../common/base/base.repository';
import { SettlementStatus } from '../../../common/enums/settlement-status.enum';

@Injectable()
export class SettlementRepository
  extends BaseRepository<Settlement>
  implements ISettlementRepository
{
  constructor(
    @InjectRepository(Settlement)
    protected readonly repository: Repository<Settlement>,
  ) {
    super(repository);
  }

  async findByIdWithRelations(id: string): Promise<Settlement | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['payer', 'receiver'],
    });
  }

  async findByLoanId(loanId: string): Promise<Settlement | null> {
    return this.repository.findOne({
      where: { loanId },
      relations: ['payer', 'receiver'],
    });
  }

  async getTotalSettledAmount(loanId: string): Promise<number> {
    const { total } = await this.repository
      .createQueryBuilder('settlement')
      .select('SUM(settlement.amount)', 'total')
      .where('settlement.loanId = :loanId', { loanId })
      .andWhere('settlement.status = :status', {
        status: SettlementStatus.CONFIRMED,
      })
      .getRawOne();

    return parseFloat(total) || 0;
  }
}
