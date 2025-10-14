import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Category } from './entities/category.entity';
import { Expense } from './entities/expense.entity';
import { CategoryRepository } from './repositories/category.repository';
import { ExpenseRepository } from './repositories/expense.repository';
import { Budget } from './entities/budget.entity';
import { BudgetController } from './budget/budget.controller';
import { BudgetService } from './budget/budget.service';
import { BudgetRepository } from './repositories/budget.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Expense, Budget])],
  controllers: [ExpenseController, BudgetController],
  providers: [
    ExpenseService,
    CategoryRepository,
    ExpenseRepository,
    BudgetService,
    BudgetRepository,
  ],
})
export class ExpenseModule {}
