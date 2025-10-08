import { IsOptional, IsNumber, IsEnum, IsString, IsDateString, IsUUID } from 'class-validator';
import { ExpenseType } from '../../../common/enums/expense-type.enum';

export class UpdateExpenseDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(ExpenseType)
  type?: ExpenseType;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
