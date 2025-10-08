import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../entities/loan.entity';
import { ILoanRepository } from '../interfaces/loan.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class LoanRepository extends BaseRepository<Loan> implements ILoanRepository {
  constructor(
    @InjectRepository(Loan)
    protected readonly repository: Repository<Loan>,
  ) {
    super(repository);
  }

  async findAllByUserId(userId: string, filters?: any): Promise<Loan[]> {
    const query = this.repository.createQueryBuilder('loan');

    query.where('loan.lenderId = :userId OR loan.borrowerId = :userId', { userId });

    if (filters && filters.status) {
      query.andWhere('loan.status = :status', { status: filters.status });
    }

    return query.getMany();
  }
}
