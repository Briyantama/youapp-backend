import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ulid } from 'ulid';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ default: () => ulid() })
  _id: string;

  @Prop({ type: String, ref: 'User', required: true })
  user: string;

  @Prop()
  fullName: string;

  @Prop()
  gender: string;

  @Prop({ required: true })
  birthday: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  age: number;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  interests: string[];

  @Prop()
  profilePictureUrl: string;

  @Prop()
  deletedAt?: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
