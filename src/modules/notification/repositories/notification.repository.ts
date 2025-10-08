import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { INotificationRepository } from '../interfaces/notification.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class NotificationRepository
  extends BaseRepository<Notification>
  implements INotificationRepository
{
  constructor(
    @InjectRepository(Notification)
    protected readonly repository: Repository<Notification>,
  ) {
    super(repository);
  }

  async findAllByUserId(userId: string): Promise<Notification[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification | null> {
    await this.repository.update(id, { isRead: true });
    return this.findById(id);
  }
}
