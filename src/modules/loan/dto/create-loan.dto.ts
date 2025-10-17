import { IsNotEmpty, IsNumber, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  @IsNotEmpty()
  borrowerId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}


export class CreateMultipleLoanDto {
  @IsUUID('all')
  @IsNotEmpty()
  borrowerIds: string[];

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}