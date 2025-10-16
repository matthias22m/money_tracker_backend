import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { FriendsRepository } from '../friends/repositories/friends.repository';
import { FriendRequestsRepository } from '../friends/repositories/friend-requests.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly friendsRepository: FriendsRepository,
    private readonly friendRequestsRepository: FriendRequestsRepository,
  ) {}

  async searchUsers(
    query: string,
    currentUserId: string,
    excludeFriends: boolean,
  ): Promise<any[]> {
    if (!query) {
      return [];
    }

    let friendIds: string[] = [];
    if (excludeFriends) {
      const friends = await this.friendsRepository.findByUserId(currentUserId);
      friendIds = friends.map((friend) => friend.friendId);
    }

    const users = await this.usersRepository.search(
      query,
      currentUserId,
      excludeFriends,
      friendIds,
    );

    return this.addFriendRequestStatus(users, currentUserId);
  }

  private async addFriendRequestStatus(
    users: User[],
    currentUserId: string,
  ): Promise<any[]> {
    const friends = await this.friendsRepository.findByUserId(currentUserId);
    const friendIds = friends.map((f) => f.friendId);

    const sentRequests = await this.friendRequestsRepository.findSentRequests(
      currentUserId,
    );
    const receivedRequests = await this.friendRequestsRepository.findReceivedRequests(
      currentUserId,
    );

    const sentRequestReceiverIds = sentRequests.map((req) => req.receiverId);
    const receivedRequestSenderIds = receivedRequests.map((req) => req.senderId);

    return users.map((user) => {
      const isFriend = friendIds.includes(user.id);
      const hasPendingRequest =
        sentRequestReceiverIds.includes(user.id) ||
        receivedRequestSenderIds.includes(user.id);

      return {
        ...user,
        isFriend,
        hasPendingRequest,
      };
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingEmail = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.usersRepository.findByUsername(
      createUserDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findByVerificationToken(token);
  }

  async findByEmailChangeToken(token: string): Promise<User | null> {
    return this.usersRepository.findByEmailChangeToken(token);
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findByPasswordResetToken(token);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // If updating email, check uniqueness
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // If updating username, check uniqueness
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.usersRepository.findByUsername(
        updateUserDto.username,
      );
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.usersRepository.update(id, updateUserDto);
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updated;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
