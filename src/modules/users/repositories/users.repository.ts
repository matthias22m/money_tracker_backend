import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class UsersRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  async search(
    query: string,
    currentUserId: string,
    excludeFriends: boolean,
    friendIds: string[],
  ): Promise<User[]> {
    const queryBuilder = this.repository.createQueryBuilder('user');

    queryBuilder.where(
      '(user.username ILIKE :query OR user.name ILIKE :query OR user.email ILIKE :query)',
      { query: `%${query}%` },
    );

    queryBuilder.andWhere('user.id != :currentUserId', { currentUserId });

    if (excludeFriends && friendIds.length > 0) {
      queryBuilder.andWhere('user.id NOT IN (:...friendIds)', { friendIds });
    }

    return queryBuilder.getMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { verificationToken: token } });
  }

  async findByEmailChangeToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { emailChangeToken: token } });
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { passwordResetToken: token } });
  }
}
