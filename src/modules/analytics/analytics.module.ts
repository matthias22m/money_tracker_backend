import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../expense/entities/expense.entity';
import { Loan } from '../loan/entities/loan.entity';
import { Settlement } from '../settlement/entities/settlement.entity';
import { ExpenseModule } from '../expense/expense.module';
import { LoanModule } from '../loan/loan.module';
import { SettlementModule } from '../settlement/settlement.module';
import { AnalyticsController } from './analytics.controller';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, Loan, Settlement]),
    ExpenseModule,
    LoanModule,
    SettlementModule,
  ],
  controllers: [AnalyticsController, AdminAnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
