import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { calculateZodiacAndHoroscope } from '../common/utils/zodiac.util';
import { Profile } from 'src/schemas/profile.schema';
import { CreateProfileDto } from 'src/dtos/create-profile.dto';
import { UpdateProfileDto } from 'src/dtos/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async createProfile(userId: string, dto: CreateProfileDto) {
    const { zodiac, horoscope } = calculateZodiacAndHoroscope(dto.birthday);

    const profile = new this.profileModel({
      ...dto,
      user: userId,
      zodiac: zodiac,
      horoscope: horoscope,
    });

    return profile.save();
  }

  async getProfile(userId: string) {
    const profile = await this.profileModel.findOne({ user: userId });

    if (!profile) throw new NotFoundException('Profile not found');

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!dto.birthday) {
      throw new BadRequestException(
        'Birthday is required to calculate zodiac and horoscope',
      );
    }

    const { zodiac, horoscope } = calculateZodiacAndHoroscope(dto.birthday);

    return this.profileModel.findOneAndUpdate(
      { user: userId },
      { $set: dto, zodiac, horoscope },
      { new: true },
    );
  }
}
