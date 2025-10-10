import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { FriendRequestsRepository } from './repositories/friend-requests.repository';
import { FriendsRepository } from './repositories/friends.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { FriendStatus } from '../../common/enums/friend-status.enum';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRequestsRepository: FriendRequestsRepository,
    private readonly friendsRepository: FriendsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot send a friend request to yourself');
    }

    const receiver = await this.usersRepository.findById(receiverId);
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    const existingRequest = await this.friendRequestsRepository.findPendingRequest(
      senderId,
      receiverId,
    );
    if (existingRequest) {
      throw new ConflictException('A pending friend request already exists');
    }

    const existingFriendship = await this.friendsRepository.findFriendship(
      senderId,
      receiverId,
    );
    if (existingFriendship) {
      throw new ConflictException('You are already friends');
    }

    return this.friendRequestsRepository.create({ senderId, receiverId });
  }

  async acceptRequest(userId: string, requestId: string) {
    const request = await this.friendRequestsRepository.findById(requestId);

    if (!request || request.receiverId !== userId) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.status !== FriendStatus.PENDING) {
      throw new BadRequestException('Friend request is not pending');
    }

    await this.friendRequestsRepository.update(requestId, {
      status: FriendStatus.ACCEPTED,
    });

    await this.friendsRepository.create({ userId: request.senderId, friendId: request.receiverId });
    await this.friendsRepository.create({ userId: request.receiverId, friendId: request.senderId });

    return { message: 'Friend request accepted' };
  }

  async rejectRequest(userId: string, requestId: string) {
    const request = await this.friendRequestsRepository.findById(requestId);

    if (!request || request.receiverId !== userId) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.status !== FriendStatus.PENDING) {
      throw new BadRequestException('Friend request is not pending');
    }

    await this.friendRequestsRepository.update(requestId, {
      status: FriendStatus.REJECTED,
    });

    return { message: 'Friend request rejected' };
  }

  async listFriendRequests(userId: string, type: 'sent' | 'received') {
    if (type === 'sent') {
      return this.friendRequestsRepository.findSentRequests(userId);
    }
    return this.friendRequestsRepository.findReceivedRequests(userId);
  }

  async listFriends(userId: string) {
    return this.friendsRepository.findByUserId(userId);
  }

  async removeFriend(userId: string, friendId: string) {
    const deleted = await this.friendsRepository.deleteByUserAndFriend(userId, friendId);
    if (!deleted) {
      throw new NotFoundException('Friendship not found');
    }
    return { message: 'Friend removed' };
  }
}
