import { IsNumber, IsPositive, IsOptional, IsString, IsISO8601 } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupExpenseDto {
  @ApiProperty({ description: 'Total amount to split', example: 100.50, minimum: 0.01 })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be greater than 0' })
  amount: number;

  @ApiPropertyOptional({ description: 'Description of the expense', example: 'Dinner at restaurant' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Date of the expense in ISO 8601 format', example: '2025-10-16T23:00:00Z' })
  @IsOptional()
  @IsISO8601({}, { message: 'Date must be in ISO 8601 format' })
  date?: string;
}
