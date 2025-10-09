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
