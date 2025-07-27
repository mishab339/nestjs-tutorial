import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateProfileDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must be at most 50 characters long' })
  firstName?: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must be at most 50 characters long' })
  lastName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
