import { IsNotEmpty, IsNumber, IsEnum, IsString, IsDateString, IsUUID, IsOptional, IsDate } from 'class-validator';
import { ExpenseType } from '../../../common/enums/expense-type.enum';
import { Type } from 'class-transformer';

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

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
