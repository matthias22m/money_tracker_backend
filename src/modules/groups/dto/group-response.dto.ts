import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  memberId: string;

  @ApiProperty()
  memberName: string;

  @ApiProperty()
  memberUsername: string;

  @ApiProperty()
  createdAt: Date;
}

export class GroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ type: [GroupMemberResponseDto] })
  members: GroupMemberResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GroupExpenseResponseDto {
  @ApiProperty()
  groupExpenseId: string;

  @ApiProperty({ description: 'Array of created loan IDs', type: [String] })
  loanIds: string[];

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  participantsCount: number;

  @ApiProperty()
  message: string;
}
