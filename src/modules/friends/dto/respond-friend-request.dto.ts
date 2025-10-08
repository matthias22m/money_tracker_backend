import { IsEnum } from 'class-validator';
import { FriendStatus } from '../../../common/enums/friend-status.enum';

export class RespondFriendRequestDto {
  @IsEnum(FriendStatus)
  status: FriendStatus.ACCEPTED | FriendStatus.REJECTED;
}
