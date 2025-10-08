import { NotificationType } from '../../../common/enums/notification-type.enum';

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  loanId?: string;
  settlementId?: string;
  friendRequestId?: string;
  createdAt: Date;
}

export interface INotificationRepository {
  create(data: Partial<INotification>): Promise<INotification>;
  findAllByUserId(userId: string): Promise<INotification[]>;
  markAsRead(id: string): Promise<INotification | null>;
}
