export interface IFriend {
  id: string;
  userId: string;
  friendId: string;
  createdAt: Date;
}

export interface IFriendRepository {
  findAll(): Promise<IFriend[]>;
  findById(id: string): Promise<IFriend | null>;
  findByUserId(userId: string): Promise<IFriend[]>;
  findFriendship(userId: string, friendId: string): Promise<IFriend | null>;
  create(data: Partial<IFriend>): Promise<IFriend>;
  delete(id: string): Promise<boolean>;
  deleteByUserAndFriend(userId: string, friendId: string): Promise<boolean>;
}
