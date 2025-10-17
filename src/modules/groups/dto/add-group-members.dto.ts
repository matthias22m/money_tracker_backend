import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddGroupMembersDto {
  @ApiProperty({ description: 'Array of user IDs to add as members', type: [String], example: ['uuid1', 'uuid2'] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one member must be provided' })
  @IsUUID('4', { each: true, message: 'Each member must be a valid UUID' })
  members: string[];
}
