import { Injectable } from '@nestjs/common';
import { NotificationEmitter } from './events/notification.emitter';
import { NotificationRepository } from './repositories/notification.repository';
import { LoanRepository } from '../loan/repositories/loan.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Loan } from '../loan/entities/loan.entity';
import { Settlement } from '../settlement/entities/settlement.entity';
import { Complaint } from '../complaint/entities/complaint.entity';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationEmitter: NotificationEmitter,
    private readonly loanRepository: LoanRepository,
  ) {}

  async notifyLoanCreated(loan: Loan) {
    const message = `A loan of ${loan.amount} was created by a friend.`;
    await this.pushNotification(
      loan.borrowerId,
      NotificationType.LOAN_CREATED,
      message,
      loan.id,
    );
  }

  async notifySettlementSubmitted(settlement: Settlement) {
    const message = `A settlement of ${settlement.amount} was submitted for loan ${settlement.loanId}.`;
    await this.pushNotification(
      settlement.receiverId,
      NotificationType.SETTLEMENT_PENDING,
      message,
      settlement.loanId,
      settlement.id,
    );
  }

  async notifySettlementConfirmed(settlement: Settlement) {
    const message = `A settlement of ${settlement.amount} was confirmed for loan ${settlement.loanId}.`;
    await this.pushNotification(
      settlement.payerId,
      NotificationType.SETTLEMENT_CONFIRMED,
      message,
      settlement.loanId,
      settlement.id,
    );
  }

  async notifyComplaintCreated(complaint: Complaint) {
    const message = `A complaint was submitted for loan ${complaint.loanId}: ${complaint.reason}`;
    // Assuming the target is the lender
    const loan = await this.loanRepository.findById(complaint.loanId); // This will cause an error, will fix later
    await this.pushNotification(
      loan.lenderId,
      NotificationType.COMPLAINT_FILED,
      message,
      complaint.loanId,
    );
  }

  async notifyComplaintResolved(complaint: Complaint) {
    const message = `Your complaint for loan ${complaint.loanId} has been ${complaint.status}.`;
    // Assuming the target is the borrower
    await this.pushNotification(
      complaint.userId,
      NotificationType.COMPLAINT_RESOLVED,
      message,
      complaint.loanId,
    );
  }

  private async pushNotification(
    userId: string,
    type: NotificationType,
    message: string,
    loanId?: string,
    settlementId?: string,
  ) {
    const notification = await this.notificationRepository.create({
      userId,
      type,
      message,
      loanId,
      settlementId,
      isRead: false,
    });

    this.notificationEmitter.emit(notification);
  }

  async findAll(userId: string) {
    return this.notificationRepository.findAllByUserId(userId);
  }

  async markAsRead(id: string) {
    return this.notificationRepository.markAsRead(id);
  }
}
