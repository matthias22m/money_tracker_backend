import { IsNotEmpty, IsString, IsHexColor, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsHexColor()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  icon: string;
}
