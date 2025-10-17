import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { IGroupRepository } from '../interfaces/group.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class GroupRepository extends BaseRepository<Group> implements IGroupRepository {
  constructor(
    @InjectRepository(Group)
    protected readonly repository: Repository<Group>,
  ) {
    super(repository);
  }

  async findByOwnerId(ownerId: string): Promise<Group[]> {
    return this.repository.find({
      where: { ownerId },
      relations: ['members', 'members.member'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByOwnerIdAndName(ownerId: string, name: string): Promise<Group | null> {
    return this.repository.findOne({
      where: { ownerId, name },
    });
  }

  async findById(id: string): Promise<Group | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.member'],
    });
  }
}
