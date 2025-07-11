import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'briyantama123' })
  username: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2000-01-01' })
  birthday: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty({ example: Gender.Male, enum: Gender })
  gender: Gender;

  @IsNumber()
  @ApiProperty({ example: 175 })
  height: number;

  @IsNumber()
  @ApiProperty({ example: 65 })
  weight: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  interests?: string[];

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;
}
