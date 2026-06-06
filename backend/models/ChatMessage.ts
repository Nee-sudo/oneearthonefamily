import { Schema, model, Document } from 'mongoose';
import { getNextSequenceValue } from './Counter';

export interface IChatMessage extends Document {
  id: number;
  roomId: number;
  senderId: string;
  senderName: string;
  messageText: string;
  timestamp: number;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    id: { type: Number, unique: true },
    roomId: { type: Number, required: true, index: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    messageText: { type: String, required: true },
    timestamp: { type: Number, default: () => Date.now() }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

ChatMessageSchema.index({ roomId: 1, timestamp: -1 });

ChatMessageSchema.pre<IChatMessage>('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue('message_id');
  }
  next();
});

export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema);
