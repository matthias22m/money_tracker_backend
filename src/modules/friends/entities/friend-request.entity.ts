import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FriendStatus } from '../../../common/enums/friend-status.enum';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'receiver_id', type: 'uuid' })
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({
    type: 'varchar',
    length: 20,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
