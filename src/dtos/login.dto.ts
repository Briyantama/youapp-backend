import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe or johndoe@example.com' })
  identifier: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}
