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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProfileArgsDto } from 'src/dtos/create-profile-args.dto';
import { UpdateProfileArgsDto } from 'src/dtos/update-profile-args.dto';
import { UpdateProfileResultDto } from 'src/dtos/update-profile-result.dto';
import { CreateProfileResultDto } from 'src/dtos/create-profile-result.dto';
import { GetProfileResultDto } from 'src/dtos/get-profile-result.dto';

@ApiTags('Profile')
@ApiBearerAuth('access-token')
@Controller('api/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  createProfile(
    @Body() dto: CreateProfileArgsDto,
    @Req() req: Request,
  ): Promise<CreateProfileResultDto> {
    const payload = req.user as string;

    if (!payload) {
      throw new UnauthorizedException('User not registered');
    }

    return this.profileService.createProfile(payload, dto);
  }

  @Get()
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  getProfile(@Req() req: Request): Promise<GetProfileResultDto> {
    const payload = req.user as string;

    if (!payload) {
      throw new UnauthorizedException('User not registered');
    }

    return this.profileService.getProfile(payload);
  }

  @Put()
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async updateProfile(
    @Body() dto: UpdateProfileArgsDto,
    @Req() req: Request,
  ): Promise<UpdateProfileResultDto> {
    const id = req.user as string;

    if (!id) {
      throw new UnauthorizedException('User not registered');
    }

    return this.profileService.updateProfile(id, dto);
  }
}
