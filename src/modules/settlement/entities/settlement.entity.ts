import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Loan } from '../../loan/entities/loan.entity';
import { User } from '../../users/entities/user.entity';
import { SettlementStatus } from '../../../common/enums/settlement-status.enum';

@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'loan_id', type: 'uuid' })
  loanId: string;

  @ManyToOne(() => Loan, (loan) => loan.settlements)
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column({ name: 'payer_id', type: 'uuid' })
  payerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'payer_id' })
  payer: User;

  @Column({ name: 'receiver_id', type: 'uuid' })
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: SettlementStatus, default: SettlementStatus.PENDING })
  status: SettlementStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
