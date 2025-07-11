import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MessagePayload } from 'src/common/interface/message.interface';

@Injectable()
export class ChatPublisher {
  private readonly logger = new Logger(ChatPublisher.name);

  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  notifyMessageSent(payload: MessagePayload) {
    this.logger.log(`Publishing message event: ${JSON.stringify(payload)}`);

    this.client.emit('chat_message', payload);
  }
}
