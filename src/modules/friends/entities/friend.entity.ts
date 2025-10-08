import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('friends')
@Index(['userId', 'friendId'], { unique: true })
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'friend_id', type: 'uuid' })
  friendId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'friend_id' })
  friend: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
