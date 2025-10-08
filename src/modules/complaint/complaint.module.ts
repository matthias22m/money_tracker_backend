import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { Complaint } from './entities/complaint.entity';
import { ComplaintRepository } from './repositories/complaint.repository';
import { LoanModule } from '../loan/loan.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint]), LoanModule, NotificationModule],
  controllers: [ComplaintController],
  providers: [ComplaintService, ComplaintRepository],
})
export class ComplaintModule {}
