import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { IFriendRequestRepository } from '../interfaces/friend-request.interface';
import { BaseRepository } from '../../../common/base/base.repository';
import { FriendStatus } from '../../../common/enums/friend-status.enum';

@Injectable()
export class FriendRequestsRepository
  extends BaseRepository<FriendRequest>
  implements IFriendRequestRepository
{
  constructor(
    @InjectRepository(FriendRequest)
    protected readonly repository: Repository<FriendRequest>,
  ) {
    super(repository);
  }

  async findPendingRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest | null> {
    return this.repository.findOne({
      where: [
        { senderId, receiverId, status: FriendStatus.PENDING },
        { senderId: receiverId, receiverId: senderId, status: FriendStatus.PENDING },
      ],
    });
  }

  async findByReceiverId(receiverId: string): Promise<FriendRequest[]> {
    return this.repository.find({
      where: { receiverId, status: FriendStatus.PENDING },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySenderId(senderId: string): Promise<FriendRequest[]> {
    return this.repository.find({
      where: { senderId, status: FriendStatus.PENDING },
      relations: ['receiver'],
      order: { createdAt: 'DESC' },
    });
  }
}
