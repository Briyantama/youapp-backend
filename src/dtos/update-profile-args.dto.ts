import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProfileArgsDto } from './create-profile-args.dto';

export class UpdateProfileArgsDto extends PartialType(CreateProfileArgsDto) {
  @ApiPropertyOptional({ example: 180 })
  height?: number;

  @ApiPropertyOptional({ example: 'Suka lari pagi dan membaca buku.' })
  bio?: string;

  @ApiPropertyOptional({ example: ['running', 'reading'] })
  interests?: string[];
}
