import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({ example: 180 })
  height?: number;

  @ApiPropertyOptional({ example: 'Suka lari pagi dan membaca buku.' })
  bio?: string;

  @ApiPropertyOptional({ example: ['running', 'reading'] })
  interests?: string[];
}
