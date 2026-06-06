import { Schema, model, Document } from 'mongoose';
import { getNextSequenceValue } from './Counter';

export interface IComment extends Document {
  id: number;
  postId: number;
  authorName: string;
  authorFlag: string;
  authorRank: string;
  content: string;
  timestamp: number;
}

const CommentSchema = new Schema<IComment>(
  {
    id: { type: Number, unique: true },
    postId: { type: Number, required: true, index: true },
    authorName: { type: String, required: true },
    authorFlag: { type: String, required: true },
    authorRank: { type: String, default: "Citizen" },
    content: { type: String, required: true },
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

CommentSchema.pre<IComment>('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue('comment_id');
  }
  next();
});

export const Comment = model<IComment>('Comment', CommentSchema);
