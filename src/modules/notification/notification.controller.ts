import { Controller, Get, Patch, Param, UseGuards, Req, Sse, MessageEvent, Query } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { NotificationEmitter } from './events/notification.emitter';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  private streams: Record<string, Subject<MessageEvent>> = {};

  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationEmitter: NotificationEmitter,
  ) {
    this.notificationEmitter.subscribe((notification) => {
      this.pushNotification(notification.userId, notification);
    });
  }

  @Sse('stream')
  streamNotifications(@Query('userId') userId: string): Observable<MessageEvent> {
    if (!this.streams[userId]) {
      this.streams[userId] = new Subject<MessageEvent>();
    }
    return this.streams[userId].asObservable();
  }

  pushNotification(userId: string, data: any) {
    if (this.streams[userId]) {
      this.streams[userId].next({ data });
    }
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return this.notificationService.findAll(req.user.userId, limit, offset);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch(':id/unread')
  markAsUnread(@Param('id') id: string) {
    return this.notificationService.markAsUnread(id);
  }
}
