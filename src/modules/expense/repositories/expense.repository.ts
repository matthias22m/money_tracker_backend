import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { IExpenseRepository } from '../interfaces/expense.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class ExpenseRepository
  extends BaseRepository<Expense>
  implements IExpenseRepository
{
  constructor(
    @InjectRepository(Expense)
    protected readonly repository: Repository<Expense>,
  ) {
    super(repository);
  }

  async findAllByUserId(userId: string, filters?: any): Promise<Expense[]> {
    const query = this.repository.createQueryBuilder('expense');

    query.where('expense.userId = :userId', { userId });

    if (filters) {
      if (filters.type) {
        query.andWhere('expense.type = :type', { type: filters.type });
      }
      if (filters.categoryId) {
        query.andWhere('expense.categoryId = :categoryId', {
          categoryId: filters.categoryId,
        });
      }
      if (filters.startDate) {
        query.andWhere('expense.date >= :startDate', {
          startDate: filters.startDate,
        });
      }
      if (filters.endDate) {
        query.andWhere('expense.date <= :endDate', { endDate: filters.endDate });
      }
    }

    return query.getMany();
  }

  async getSummary(userId: string, filters?: any): Promise<any> {
    const query = this.repository
      .createQueryBuilder('expense')
      .select('expense.type', 'type')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId })
      .groupBy('expense.type');

    if (filters && filters.categoryId) {
      query.andWhere('expense.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    return query.getRawMany();
  }
}
