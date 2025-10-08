import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Loan } from './entities/loan.entity';
import { Settlement } from './entities/settlement.entity';
import { LoanRepository } from './repositories/loan.repository';
import { SettlementRepository } from './repositories/settlement.repository';
import { FriendsModule } from '../friends/friends.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Settlement]), FriendsModule, NotificationModule],
  controllers: [LoanController],
  providers: [LoanService, LoanRepository, SettlementRepository],
  exports: [LoanRepository],
})
export class LoanModule {}
