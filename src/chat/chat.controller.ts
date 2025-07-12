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
import { SendMessageArgsDto } from 'src/dtos/send-message-args.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('send-message')
  async sendMessage(@Body() dto: SendMessageArgsDto, @Req() req: Request) {
    const id = req.user as string;

    if (!id) {
      throw new UnauthorizedException('User not registered');
    }

    return this.chatService.sendMessage(id, dto);
  }

  @Get('view-messages')
  async viewMessages(@Req() req: Request, @Query('to') to: string) {
    const id = req.user as string;

    if (!id) {
      throw new UnauthorizedException('User not registered');
    }

    return this.chatService.getMessages(id, to);
  }
}
