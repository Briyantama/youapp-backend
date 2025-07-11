import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from 'src/dtos/create-profile.dto';
import { User } from 'src/schemas/user.schema';
import { UpdateProfileDto } from 'src/dtos/update-profile.dto';

@ApiTags('Profile')
@ApiBearerAuth('access-token')
@Controller('api/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  createProfile(@Body() dto: CreateProfileDto, @Req() req: Request) {
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return this.profileService.createProfile(user._id, dto);
  }

  @Get()
  getProfile(@Req() req: Request) {
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return this.profileService.getProfile(user._id);
  }

  @Put()
  async updateProfile(@Body() dto: UpdateProfileDto, @Req() req: Request) {
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return await this.profileService.updateProfile(user._id, dto);
  }
}
