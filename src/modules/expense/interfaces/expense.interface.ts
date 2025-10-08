import { ExpenseType } from '../../../common/enums/expense-type.enum';

export interface IExpense {
  id: string;
  amount: number;
  type: ExpenseType;
  note?: string;
  date: Date;
  userId: string;
  categoryId: string;
}

export interface IExpenseRepository {
  findAllByUserId(userId: string, filters?: any): Promise<IExpense[]>;
  findById(id: string): Promise<IExpense | null>;
  create(data: Partial<IExpense>): Promise<IExpense>;
  update(id: string, data: Partial<IExpense>): Promise<IExpense | null>;
  delete(id: string): Promise<boolean>;
  getSummary(userId: string, filters?: any): Promise<any>;
}
