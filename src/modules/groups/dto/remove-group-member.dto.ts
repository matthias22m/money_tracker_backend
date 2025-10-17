import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveGroupMemberDto {
  @ApiProperty({ description: 'User ID of the member to remove', example: 'uuid' })
  @IsUUID('4', { message: 'Member ID must be a valid UUID' })
  memberId: string;
}
