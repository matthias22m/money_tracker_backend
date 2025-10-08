import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expense/entities/expense.entity';
import { Loan } from '../loan/entities/loan.entity';
import { Settlement } from '../settlement/entities/settlement.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
  ) {}

  async getSummary(userId: string, from: Date, to: Date) {
    const expenseSummary = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(CASE WHEN expense.type = \'income\' THEN expense.amount ELSE 0 END)', 'totalIncome')
      .addSelect('SUM(CASE WHEN expense.type = \'expense\' THEN expense.amount ELSE 0 END)', 'totalExpense')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.createdAt BETWEEN :from AND :to', { from, to })
      .getRawOne();

    const loanSummary = await this.loanRepository
      .createQueryBuilder('loan')
      .select('SUM(CASE WHEN loan.lenderId = :userId THEN loan.amount ELSE 0 END)', 'totalLoansLent')
      .addSelect('SUM(CASE WHEN loan.borrowerId = :userId THEN loan.amount ELSE 0 END)', 'totalLoansBorrowed')
      .where('loan.lenderId = :userId OR loan.borrowerId = :userId', { userId })
      .andWhere('loan.createdAt BETWEEN :from AND :to', { from, to })
      .getRawOne();

    const outstandingLoans = await this.loanRepository
      .createQueryBuilder('loan')
      .leftJoin('loan.settlements', 'settlement')
      .select('SUM(loan.amount - COALESCE(settlement.amount, 0))', 'outstandingAmount')
      .where('loan.borrowerId = :userId', { userId })
      .andWhere('loan.status != \'settled\'')
      .getRawOne();

    return {
      totalIncome: parseFloat(expenseSummary.totalIncome) || 0,
      totalExpense: parseFloat(expenseSummary.totalExpense) || 0,
      balance: (parseFloat(expenseSummary.totalIncome) || 0) - (parseFloat(expenseSummary.totalExpense) || 0),
      totalLoansLent: parseFloat(loanSummary.totalLoansLent) || 0,
      totalLoansBorrowed: parseFloat(loanSummary.totalLoansBorrowed) || 0,
      outstandingLoans: parseFloat(outstandingLoans.outstandingAmount) || 0,
    };
  }

  async getCategoryBreakdown(userId: string, month: string) {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .innerJoin('expense.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('to_char(expense.createdAt, \'YYYY-MM\') = :month', { month })
      .groupBy('category.id, category.name')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  async getExpenseTrend(userId: string, months: number) {
    const query = `
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', current_date) - interval '1 month' * ($2 - 1),
          date_trunc('month', current_date),
          interval '1 month'
        ) AS m
      )
      SELECT
        to_char(m, 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN e.type = 'income' THEN e.amount END), 0)::numeric(12,2) AS income,
        COALESCE(SUM(CASE WHEN e.type = 'expense' THEN e.amount END), 0)::numeric(12,2) AS expense
      FROM months
      LEFT JOIN expenses e ON date_trunc('month', e."createdAt") = m AND e."userId" = $1
      GROUP BY m
      ORDER BY m;
    `;
    return this.expenseRepository.query(query, [userId, months]);
  }

  async getLoanSummary(userId: string) {
    const query = `
      SELECT
        SUM(CASE WHEN l."lenderId" = $1 THEN l.amount ELSE 0 END)::numeric(12,2) AS total_lent,
        SUM(CASE WHEN l."borrowerId" = $1 THEN l.amount ELSE 0 END)::numeric(12,2) AS total_borrowed,
        SUM(CASE WHEN l."borrowerId" = $1 AND l.status IN ('active','partially_paid') THEN l.amount - COALESCE(s.total_confirmed,0) ELSE 0 END)::numeric(12,2) AS outstanding_as_borrower
      FROM loans l
      LEFT JOIN (
        SELECT "loanId", SUM(amount) AS total_confirmed
        FROM settlements
        WHERE status = 'confirmed'
        GROUP BY "loanId"
      ) s ON s."loanId" = l.id
      WHERE l."lenderId" = $1 OR l."borrowerId" = $1;
    `;
    return this.loanRepository.query(query, [userId]);
  }

  async getSettlementHistory(loanId: string) {
    return this.settlementRepository.find({ where: { loanId } });
  }

  async getSystemRevenue(from: Date, to: Date) {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(CASE WHEN expense.type = \'income\' THEN expense.amount ELSE 0 END)', 'totalIncome')
      .addSelect('SUM(CASE WHEN expense.type = \'expense\' THEN expense.amount ELSE 0 END)', 'totalExpense')
      .where('expense.createdAt BETWEEN :from AND :to', { from, to })
      .getRawOne();
  }

  async getTopDebtors(limit: number) {
    const query = `
      SELECT
        l."borrowerId" AS user_id,
        SUM((l.amount)::numeric - COALESCE(s.total_confirmed,0))::numeric(12,2) AS outstanding
      FROM loans l
      LEFT JOIN (
        SELECT "loanId", SUM(amount) AS total_confirmed
        FROM settlements
        WHERE status = 'confirmed'
        GROUP BY "loanId"
      ) s ON s."loanId" = l.id
      WHERE l.status IN ('active','partially_paid')
      GROUP BY l."borrowerId"
      ORDER BY outstanding DESC
      LIMIT $1;
    `;
    return this.loanRepository.query(query, [limit]);
  }
}
