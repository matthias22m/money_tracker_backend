import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupExpense } from '../entities/group-expense.entity';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class GroupExpenseRepository extends BaseRepository<GroupExpense> {
  constructor(
    @InjectRepository(GroupExpense)
    protected readonly repository: Repository<GroupExpense>,
  ) {
    super(repository);
  }
}
