import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateSettlementDto {
  @IsUUID()
  @IsNotEmpty()
  loanId: string;

  @IsUUID()
  @IsNotEmpty()
  payerId: string;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
