import { Injectable } from '@nestjs/common';
import { NotificationEmitter } from './events/notification.emitter';
import { NotificationRepository } from './repositories/notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationEmitter: NotificationEmitter,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationRepository.create(createNotificationDto);
    this.notificationEmitter.emit(notification);
    return notification;
  }

  async findAll(userId: string) {
    return this.notificationRepository.findAllByUserId(userId);
  }

  async markAsRead(id: string) {
    return this.notificationRepository.markAsRead(id);
  }
}
