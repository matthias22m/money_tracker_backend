import { SettlementStatus } from '../../../common/enums/settlement-status.enum';

export interface ISettlement {
  id: string;
  loanId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  status: SettlementStatus;
  createdAt: Date;
}

export interface ISettlementRepository {
  create(data: Partial<ISettlement>): Promise<ISettlement>;
  findById(id: string): Promise<ISettlement | null>;
  update(id: string, data: Partial<ISettlement>): Promise<ISettlement | null>;
  findAllByLoanId(loanId: string): Promise<ISettlement[]>;
  getTotalSettledAmount(loanId: string): Promise<number>;
}
