import { Schema, model, Document } from 'mongoose';
import { getNextSequenceValue } from './Counter';

export interface IChatRoom extends Document {
  id: number;
  roomName: string;
  participantName: string;
  participantFlag: string;
  participantRank: string;
  participantTerritory: string;
  lastMessage: string;
  lastMessageTime: number;
  isActive: boolean;
  isWaiting: boolean;
}

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    id: { type: Number, unique: true },
    roomName: { type: String, required: true },
    participantName: { type: String, required: true },
    participantFlag: { type: String, default: "🌍" },
    participantRank: { type: String, default: "Citizen" },
    participantTerritory: { type: String, default: "Global" },
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: Number, default: () => Date.now() },
    isActive: { type: Boolean, default: true },
    isWaiting: { type: Boolean, default: false }
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

ChatRoomSchema.pre<IChatRoom>('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue('room_id');
  }
  next();
});

export const ChatRoom = model<IChatRoom>('ChatRoom', ChatRoomSchema);
