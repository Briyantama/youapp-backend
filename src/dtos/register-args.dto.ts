import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterArgsDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'jhondoe' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}
