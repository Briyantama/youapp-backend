import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';
import { SendMessageDto } from 'src/dtos/send-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('sendMessage')
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: Request) {
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return this.chatService.sendMessage(user._id, dto);
  }

  @Get('viewMessages')
  async viewMessages(@Req() req: Request, @Query('to') to: string) {
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return this.chatService.getMessages(user._id, to);
  }
}
