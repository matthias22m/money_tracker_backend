import { LoanStatus } from '../../../common/enums/loan-status.enum';
import { SettlementStatus } from '../../../common/enums/settlement-status.enum';

export interface ILoan {
  id: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  description?: string;
  status: LoanStatus;
  createdAt: Date;
}

export interface ISettlement {
  id: string;
  loanId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  status: SettlementStatus;
  createdAt: Date;
}

export interface ILoanRepository {
  create(data: Partial<ILoan>): Promise<ILoan>;
  findById(id: string): Promise<ILoan | null>;
  findAllByUserId(userId: string, filters?: any): Promise<ILoan[]>;
  update(id: string, data: Partial<ILoan>): Promise<ILoan | null>;
}

export interface ISettlementRepository {
  create(data: Partial<ISettlement>): Promise<ISettlement>;
  findById(id: string): Promise<ISettlement | null>;
  update(id: string, data: Partial<ISettlement>): Promise<ISettlement | null>;
  getTotalSettledAmount(loanId: string): Promise<number>;
}
