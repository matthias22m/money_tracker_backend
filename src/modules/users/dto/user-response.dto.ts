import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  profile?: string;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
