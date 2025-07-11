import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmailOrUsername(
    identifier: string,
    optionalUsername?: string,
  ): Promise<UserDocument | null> {
    if (optionalUsername) {
      return this.userModel.findOne({
        $or: [{ email: identifier }, { username: optionalUsername }],
      });
    }

    const cleanedIdentifier = identifier.trim();
    return this.userModel.findOne({
      $or: [{ email: cleanedIdentifier }, { username: cleanedIdentifier }],
      deletedAt: null,
    });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id });
  }
}
