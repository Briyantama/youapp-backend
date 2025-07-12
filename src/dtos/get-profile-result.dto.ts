import { Gender } from './create-profile-args.dto';

export class GetProfileResultDto {
  message: string;
  username: string;
  fullname: string;
  email: string;
  gender: Gender;
  zodiac: string;
  horoscope: string;
  height: string;
  weight: string;
  interests?: string[];
}
