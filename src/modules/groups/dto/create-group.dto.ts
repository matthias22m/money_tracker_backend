import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Name of the group', example: 'Weekend Squad' })
  @IsString()
  @IsNotEmpty({ message: 'Group name is required' })
  name: string;

  @ApiPropertyOptional({ description: 'Description of the group', example: 'Friends I hang out with on weekends' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Array of user IDs to add as members', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each member must be a valid UUID' })
  members?: string[];
}
