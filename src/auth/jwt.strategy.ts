import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UserService } from 'src/users/users.service';
import { Request } from 'express';
import { JwtPayload } from 'src/common/interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    const jwtExtractor: StrategyOptions['jwtFromRequest'] =
      ExtractJwt.fromAuthHeaderAsBearerToken();

    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET not defined');
    }

    const options: StrategyOptions = {
      jwtFromRequest: jwtExtractor,
      secretOrKey: secret,
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(_req: Request, payload: JwtPayload): Promise<string> {
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return payload.sub;
  }
}
