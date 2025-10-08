import { IsNotEmpty, IsNumber, IsEnum, IsString, IsDateString, IsUUID, IsOptional } from 'class-validator';
import { ExpenseType } from '../../../common/enums/expense-type.enum';

export class CreateExpenseDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(ExpenseType)
  @IsNotEmpty()
  type: ExpenseType;

  @IsOptional()
  @IsString()
  note?: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
