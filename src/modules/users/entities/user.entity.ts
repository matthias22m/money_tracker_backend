import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'text', nullable: true })
  profile?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Exclude()
  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Exclude()
  @Column({ default: 'local' })
  provider: string;

  @Exclude()
  @Column({ name: 'provider_id', nullable: true })
  providerId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @Column({ name: 'current_hashed_refresh_token', nullable: true })
  currentHashedRefreshToken?: string;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @Column({ name: 'verification_token', nullable: true })
  verificationToken?: string;

  @Exclude()
  @Column({ name: 'password_reset_token', nullable: true })
  passwordResetToken?: string;

  @Exclude()
  @Column({ name: 'password_reset_expires', nullable: true })
  passwordResetExpires?: Date;

  @Exclude()
  @Column({ name: 'new_email', nullable: true })
  newEmail?: string;

  @Exclude()
  @Column({ name: 'email_change_token', nullable: true })
  emailChangeToken?: string;
}
