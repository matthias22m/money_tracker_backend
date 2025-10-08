import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';
import { IFriendRepository } from '../interfaces/friend.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class FriendsRepository
  extends BaseRepository<Friend>
  implements IFriendRepository
{
  constructor(
    @InjectRepository(Friend)
    protected readonly repository: Repository<Friend>,
  ) {
    super(repository);
  }

  async findByUserId(userId: string): Promise<Friend[]> {
    return this.repository.find({
      where: { userId },
      relations: ['friend'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFriendship(userId: string, friendId: string): Promise<Friend | null> {
    return this.repository.findOne({
      where: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });
  }

  async deleteByUserAndFriend(userId: string, friendId: string): Promise<boolean> {
    const result = await this.repository.delete([
      { userId, friendId },
      { userId: friendId, friendId: userId },
    ]);
    return result.affected > 0;
  }
}
