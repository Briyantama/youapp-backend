import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { RegisterResultDto } from 'src/dtos/register-result.dto';
import { LoginResultDto } from 'src/dtos/login-result.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    username: string,
    password: string,
  ): Promise<RegisterResultDto> {
    const userExist = await this.usersService.findByEmailOrUsername(
      email,
      username,
    );

    if (userExist) throw new ConflictException('email or password invalid');

    const hashedPassword = await hash(password, 10);
    const newUser = await this.usersService.create({
      email,
      username,
      password: hashedPassword,
    });

    return { message: 'User registered', id: newUser._id };
  }

  async login(identifier: string, password: string): Promise<LoginResultDto> {
    const user: UserDocument | null =
      await this.usersService.findByEmailOrUsername(identifier);

    if (!user) throw new UnauthorizedException('email or password invalid');

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('email or password invalid');

    const payload = { sub: user._id };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successfully`', access_token: token };
  }
}
