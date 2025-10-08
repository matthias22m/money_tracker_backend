import { ComplaintStatus } from '../../../common/enums/complaint-status.enum';

export interface IComplaint {
  id: string;
  loanId: string;
  userId: string;
  reason: string;
  status: ComplaintStatus;
  createdAt: Date;
}

export interface IComplaintRepository {
  create(data: Partial<IComplaint>): Promise<IComplaint>;
  findById(id: string): Promise<IComplaint | null>;
  findAll(filters?: any): Promise<IComplaint[]>;
  update(id: string, data: Partial<IComplaint>): Promise<IComplaint | null>;
}
