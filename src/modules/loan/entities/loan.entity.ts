import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LoanStatus } from '../../../common/enums/loan-status.enum';
import { Settlement } from './settlement.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lender_id', type: 'uuid' })
  lenderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'lender_id' })
  lender: User;

  @Column({ name: 'borrower_id', type: 'uuid' })
  borrowerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'borrower_id' })
  borrower: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.ACTIVE })
  status: LoanStatus;

  @OneToMany(() => Settlement, (settlement) => settlement.loan)
  settlements: Settlement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
