import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Model } from 'mongoose';
import { SendMessageDto } from 'src/dtos/send-message.dto';
import { UsersService } from 'src/users/users.service';
import { ChatPublisher } from './rabbitmq/chat.publisher';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private usersService: UsersService,
    private readonly chatPublisher: ChatPublisher,
  ) {}

  async sendMessage(senderId: string, dto: SendMessageDto): Promise<Message> {
    const user = await this.usersService.findByEmailOrUsername(dto.to);

    if (!user) throw new BadRequestException('User not found');

    const newMessage = new this.messageModel({
      sender: senderId,
      receiver: user._id,
      content: dto.content,
    });

    this.chatPublisher.notifyMessageSent({
      sender: senderId,
      receiver: user._id,
      content: dto.content,
      sentAt: new Date().toISOString(),
    });

    return newMessage.save();
  }

  async getMessages(userId: string, to: string): Promise<Message[]> {
    const user = await this.usersService.findByEmailOrUsername(to);

    if (!user) throw new BadRequestException('User not found');

    return this.messageModel
      .find({
        $or: [
          { sender: userId, receiver: user._id },
          { sender: user._id, receiver: userId },
        ],
      })
      .sort();
  }
}
