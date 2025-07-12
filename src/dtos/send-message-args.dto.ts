import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageArgsDto {
  @ApiProperty({ example: 'username or email' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'Hai apa kabar?' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
