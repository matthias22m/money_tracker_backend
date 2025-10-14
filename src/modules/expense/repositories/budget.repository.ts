import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { IBudgetRepository } from '../interfaces/budget.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class BudgetRepository
  extends BaseRepository<Budget>
  implements IBudgetRepository
{
  constructor(
    @InjectRepository(Budget)
    protected readonly repository: Repository<Budget>,
  ) {
    super(repository);
  }

  async findAllByUserId(userId: string, filters?: any): Promise<Budget[]> {
    const query = this.repository.createQueryBuilder('budget');

    query.where('budget.userId = :userId', { userId });

    if (filters) {
      if (filters.month) {
        query.andWhere('budget.month = :month', { month: filters.month });
      }
      if (filters.year) {
        query.andWhere('budget.year = :year', { year: filters.year });
      }
    }

    return query.getMany();
  }
}
