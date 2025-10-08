import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveFriendDto {
  @IsNotEmpty()
  @IsUUID()
  friendId: string;
}
