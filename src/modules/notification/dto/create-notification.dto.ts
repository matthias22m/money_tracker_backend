import { IsNotEmpty, IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { NotificationType } from '../../../common/enums/notification-type.enum';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsUUID()
  loanId?: string;

  @IsOptional()
  @IsUUID()
  settlementId?: string;

  @IsOptional()
  @IsUUID()
  friendRequestId?: string;
}
