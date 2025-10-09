import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { FriendsModule } from './modules/friends/friends.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { LoanModule } from './modules/loan/loan.module';
import { ComplaintModule } from './modules/complaint/complaint.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SettlementModule } from './modules/settlement/settlement.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { MailModule } from './modules/mail/mail.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    FriendsModule,
    AuthModule,
    ExpenseModule,
    LoanModule,
    ComplaintModule,
    NotificationModule,
    SettlementModule,
    AnalyticsModule,
    MailModule,
  ],
  controllers:[AppController]
})
export class AppModule {}

