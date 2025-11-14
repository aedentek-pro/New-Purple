import { Schema, Types, model } from 'mongoose';

export interface ChatMessage {
  user: Types.ObjectId;
  text: string;
  timestamp: Date;
}

const chatMessageSchema = new Schema<ChatMessage>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ChatMessageModel = model<ChatMessage>('ChatMessage', chatMessageSchema);

