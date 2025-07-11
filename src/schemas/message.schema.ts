import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, ref: 'User', required: true })
  sender: string;

  @Prop({ type: String, ref: 'User', required: true })
  receiver: string;

  @Prop({ required: true })
  content: string;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
