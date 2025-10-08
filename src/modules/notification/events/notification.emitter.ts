import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { INotification } from '../interfaces/notification.interface';

@Injectable()
export class NotificationEmitter {
  private readonly subject = new Subject<INotification>();

  emit(notification: INotification) {
    this.subject.next(notification);
  }

  subscribe(callback: (notification: INotification) => void) {
    return this.subject.subscribe(callback);
  }
}
