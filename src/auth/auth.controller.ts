import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterArgsDto } from '../dtos/register-args.dto';
import { LoginArgsDto } from '../dtos/login-args.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResultDto } from 'src/dtos/login-result.dto';
import { RegisterResultDto } from 'src/dtos/register-result.dto';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Post('register')
  register(@Body() dto: RegisterArgsDto): Promise<RegisterResultDto> {
    return this.authService.register(dto.email, dto.username, dto.password);
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Login successfully' })
  @Post('login')
  login(@Body() dto: LoginArgsDto): Promise<LoginResultDto> {
    return this.authService.login(dto.identifier, dto.password);
  }
}
