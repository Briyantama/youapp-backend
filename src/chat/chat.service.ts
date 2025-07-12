import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Model } from 'mongoose';
import { SendMessageArgsDto } from 'src/dtos/send-message-args.dto';
import { SendMessageResultDto } from 'src/dtos/send-message-result.dto';
import { UserService } from 'src/users/users.service';
import { ViewMessagesResultDto } from 'src/dtos/view-messages-result.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private usersService: UserService,
  ) {}

  async sendMessage(
    senderId: string,
    dto: SendMessageArgsDto,
  ): Promise<SendMessageResultDto> {
    const receiver = await this.usersService.findByEmailOrUsername(dto.to);

    if (!receiver) throw new BadRequestException('Recipient user not found');

    const newMessage = new this.messageModel({
      sender: senderId,
      receiver: receiver._id,
      content: dto.content,
    });

    const savedMessage = await newMessage.save();

    if (!savedMessage) {
      throw new BadRequestException('Failed to send message');
    }

    return { message: 'ok' };
  }

  async getMessages(
    userId: string,
    to: string,
  ): Promise<ViewMessagesResultDto[]> {
    const receiver = await this.usersService.findByEmailOrUsername(to);
    const sender = await this.usersService.findById(userId);

    if (!receiver) {
      throw new BadRequestException('Recipient user not found');
    }

    if (!sender) {
      throw new BadRequestException('Sender user not found');
    }

    const messages = await this.messageModel
      .find({
        $or: [
          { sender: userId, receiver: receiver.id },
          { sender: receiver.id, receiver: userId },
        ],
      })
      .sort({ createdAt: 1 });

    return messages.map((msg) => {
      const fromUsername =
        msg.sender === userId ? sender.username : receiver.username;
      const toUsername =
        msg.receiver === receiver.id ? receiver.username : sender.username;

      return {
        message: msg.content,
        from: fromUsername,
        to: toUsername,
      };
    });
  }
}
