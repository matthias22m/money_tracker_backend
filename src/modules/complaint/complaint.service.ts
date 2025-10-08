import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ComplaintRepository } from './repositories/complaint.repository';
import { LoanRepository } from '../loan/repositories/loan.repository';
import { NotificationService } from '../notification/notification.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Injectable()
export class ComplaintService {
  constructor(
    private readonly complaintRepository: ComplaintRepository,
    private readonly loanRepository: LoanRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async createComplaint(userId: string, createComplaintDto: CreateComplaintDto) {
    const { loanId, reason } = createComplaintDto;

    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${loanId} not found`);
    }

    if (loan.borrowerId !== userId) {
      throw new BadRequestException('Only the borrower can file a complaint.');
    }

    const complaint = await this.complaintRepository.create({
      loanId,
      userId,
      reason,
    });

    this.notificationService.create({
      userId: loan.lenderId,
      type: 'complaint_filed' as any,
      message: `A complaint was filed on Loan #${loan.id}`,
      loanId: loan.id,
    });
    // TODO: Notify admin

    return complaint;
  }

  async findComplaints(filters?: any) {
    return this.complaintRepository.findAll(filters);
  }

  async updateComplaint(id: string, updateComplaintDto: UpdateComplaintDto) {
    const complaint = await this.complaintRepository.update(id, updateComplaintDto);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    const loan = await this.loanRepository.findById(complaint.loanId);
    this.notificationService.create({
      userId: loan.lenderId,
      type: 'complaint_resolved' as any,
      message: `Your complaint on Loan #${loan.id} has been resolved.`,
      loanId: loan.id,
    });
    this.notificationService.create({
      userId: loan.borrowerId,
      type: 'complaint_resolved' as any,
      message: `The complaint on Loan #${loan.id} has been resolved.`,
      loanId: loan.id,
    });

    return complaint;
  }
}
