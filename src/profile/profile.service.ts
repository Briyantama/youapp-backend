import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { calculateZodiacAndHoroscope } from '../common/utils/zodiac.util';
import { Profile } from 'src/schemas/profile.schema';
import { User } from 'src/schemas/user.schema';

import { CreateProfileArgsDto } from 'src/dtos/create-profile-args.dto';
import { UpdateProfileArgsDto } from 'src/dtos/update-profile-args.dto';
import { CreateProfileResultDto } from 'src/dtos/create-profile-result.dto';
import { UpdateProfileResultDto } from 'src/dtos/update-profile-result.dto';
import { GetProfileResultDto } from 'src/dtos/get-profile-result.dto';
import { UserService as UserService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private userSevice: UserService,
  ) {}

  private async getUserOrThrow(userId: string): Promise<User> {
    const user = await this.userSevice.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  private async getProfileOrThrow(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({
      user: userId,
      deletedAt: null,
    });

    if (!profile) throw new NotFoundException('Profile not found');

    return profile;
  }

  async createProfile(
    userId: string,
    dto: CreateProfileArgsDto,
  ): Promise<CreateProfileResultDto> {
    const { zodiac, horoscope } = calculateZodiacAndHoroscope(dto.birthday);

    const profile = new this.profileModel({
      ...dto,
      user: userId,
      zodiac,
      horoscope,
    });

    const savedProfile = await profile.save();

    if (!savedProfile) {
      throw new BadRequestException(
        'Failed to create profile. Please check the input.',
      );
    }

    return {
      message: 'Profile created successfully',
      id: savedProfile._id,
    };
  }

  async getProfile(userId: string): Promise<GetProfileResultDto> {
    const user = await this.getUserOrThrow(userId);
    const profile = await this.getProfileOrThrow(userId);

    return {
      username: user.username,
      email: user.email,
      fullname: profile.fullName,
      gender: profile.gender,
      height: `${profile.height} cm`,
      weight: `${profile.weight} kg`,
      message: 'Success',
      zodiac: profile.zodiac,
      horoscope: profile.horoscope,
      interests: profile.interests,
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileArgsDto,
  ): Promise<UpdateProfileResultDto> {
    if (!dto.birthday) {
      throw new BadRequestException(
        'Birthday is required to calculate zodiac and horoscope',
      );
    }

    const { zodiac, horoscope } = calculateZodiacAndHoroscope(dto.birthday);

    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { user: userId, deletedAt: null },
      { $set: { ...dto, zodiac, horoscope } },
      { new: true },
    );

    if (!updatedProfile) {
      throw new BadRequestException(
        'Failed to update profile. Profile not found or input is invalid.',
      );
    }

    return {
      message: 'Profile updated successfully',
      id: updatedProfile._id,
    };
  }
}
