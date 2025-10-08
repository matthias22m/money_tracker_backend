import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendsRepository } from './repositories/friends.repository';
import { FriendRequestsRepository } from './repositories/friend-requests.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, FriendRequest]), UsersModule],
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository, FriendRequestsRepository],
})
export class FriendsModule {}
