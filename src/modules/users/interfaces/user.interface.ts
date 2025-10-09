export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  profile?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  provider: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByVerificationToken(token: string): Promise<IUser | null>;
  findByEmailChangeToken(token: string): Promise<IUser | null>;
  findByPasswordResetToken(token: string): Promise<IUser | null>;
  create(data: Partial<IUser>): Promise<IUser>;
  update(id: string, data: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}
