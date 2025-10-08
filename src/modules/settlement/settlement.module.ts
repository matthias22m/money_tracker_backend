import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { Settlement } from './entities/settlement.entity';
import { SettlementRepository } from './repositories/settlement.repository';
import { LoanModule } from '../loan/loan.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Settlement]), LoanModule, NotificationModule],
  controllers: [SettlementController],
  providers: [SettlementService, SettlementRepository],
})
export class SettlementModule {}
