import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessagePayload } from 'src/common/interface/message.interface';

@Controller()
export class ChatConsumer {
  private readonly logger = new Logger(ChatConsumer.name);

  @EventPattern('chat_message')
  handleMessageNotification(@Payload() data: MessagePayload) {
    this.logger.log(`📨 New message received: ${JSON.stringify(data)}`);

    this.logger.log(
      `🔔 Notify user ${JSON.stringify(data)} that message arrived.`,
    );
  }
}
