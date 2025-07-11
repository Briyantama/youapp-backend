import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: '01JZPX...' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'Hai apa kabar?' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
