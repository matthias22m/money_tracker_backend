import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Category } from './entities/category.entity';
import { Expense } from './entities/expense.entity';
import { CategoryRepository } from './repositories/category.repository';
import { ExpenseRepository } from './repositories/expense.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService, CategoryRepository, ExpenseRepository],
})
export class ExpenseModule {}
