import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.create(createNotificationDto);
  }

  async findAll(userId: string) {
    return this.notificationRepository.findAllByUserId(userId);
  }

  async markAsRead(id: string) {
    return this.notificationRepository.markAsRead(id);
  }
}
