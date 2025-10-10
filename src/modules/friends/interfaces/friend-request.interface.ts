import { FriendStatus } from '../../../common/enums/friend-status.enum';

export interface IFriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFriendRequestRepository {
  findAll(): Promise<IFriendRequest[]>;
  findById(id: string): Promise<IFriendRequest | null>;
  findPendingRequest(senderId: string, receiverId: string): Promise<IFriendRequest | null>;
  findReceivedRequests(receiverId: string): Promise<IFriendRequest[]>;
  findSentRequests(senderId: string): Promise<IFriendRequest[]>;
  create(data: Partial<IFriendRequest>): Promise<IFriendRequest>;
  update(id: string, data: Partial<IFriendRequest>): Promise<IFriendRequest | null>;
  delete(id: string): Promise<boolean>;
}
