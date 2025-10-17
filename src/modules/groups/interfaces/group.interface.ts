import { Group } from '../entities/group.entity';
import { GroupMember } from '../entities/group-member.entity';

export interface IGroupRepository {
  findAll(): Promise<Group[]>;
  findById(id: string): Promise<Group | null>;
  findByOwnerId(ownerId: string): Promise<Group[]>;
  findByOwnerIdAndName(ownerId: string, name: string): Promise<Group | null>;
  create(data: Partial<Group>): Promise<Group>;
  update(id: string, data: Partial<Group>): Promise<Group | null>;
  delete(id: string): Promise<boolean>;
}

export interface IGroupMemberRepository {
  findAll(): Promise<GroupMember[]>;
  findById(id: string): Promise<GroupMember | null>;
  findByGroupId(groupId: string): Promise<GroupMember[]>;
  findByGroupIdAndMemberId(groupId: string, memberId: string): Promise<GroupMember | null>;
  create(data: Partial<GroupMember>): Promise<GroupMember>;
  delete(id: string): Promise<boolean>;
  deleteByGroupIdAndMemberId(groupId: string, memberId: string): Promise<boolean>;
}
