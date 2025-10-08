import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotificationType } from '../../../common/enums/notification-type.enum';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  // Optional foreign keys to related entities
  @Column({ name: 'loan_id', type: 'uuid', nullable: true })
  loanId?: string;

  @Column({ name: 'settlement_id', type: 'uuid', nullable: true })
  settlementId?: string;

  @Column({ name: 'friend_request_id', type: 'uuid', nullable: true })
  friendRequestId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
