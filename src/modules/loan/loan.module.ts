import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Loan } from './entities/loan.entity';
import { LoanRepository } from './repositories/loan.repository';
import { FriendsModule } from '../friends/friends.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loan]), FriendsModule, NotificationModule],
  controllers: [LoanController],
  providers: [LoanService, LoanRepository],
  exports: [LoanRepository],
})
export class LoanModule {}
