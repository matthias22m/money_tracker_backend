import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupRepository } from './repositories/group.repository';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { GroupExpenseRepository } from './repositories/group-expense.repository';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { GroupExpense } from './entities/group-expense.entity';
import { Loan } from '../loan/entities/loan.entity';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMember, GroupExpense, Loan]),
    UsersModule,
    NotificationModule,
  ],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    GroupRepository,
    GroupMemberRepository,
    GroupExpenseRepository,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
