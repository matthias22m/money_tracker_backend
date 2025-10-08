import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateComplaintDto {
  @IsUUID()
  @IsNotEmpty()
  loanId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
