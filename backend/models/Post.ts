import { Schema, model, Document } from 'mongoose';
import { getNextSequenceValue } from './Counter';

export interface IPost extends Document {
  id: number;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorRank: string;
  authorTerritory: string;
  authorFlag: string;
  content: string;
  category: string;
  timestamp: number;
  knowledgeValue: number;
  contributionProof: number;
  reputationImpact: number;
  reactedWiseUsers: string; // Comma separated user IDs
  reactedHelpfulUsers: string; // Comma separated user IDs
  reactedInspiringUsers: string; // Comma separated user IDs
}

const PostSchema = new Schema<IPost>(
  {
    id: { type: Number, unique: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorUsername: { type: String, required: true },
    authorRank: { type: String, default: "Citizen" },
    authorTerritory: { type: String, default: "Global" },
    authorFlag: { type: String, default: "🌍" },
    content: { type: String, required: true },
    category: { type: String, required: true, index: true },
    timestamp: { type: Number, default: () => Date.now() },
    knowledgeValue: { type: Number, default: 0 },
    contributionProof: { type: Number, default: 0 },
    reputationImpact: { type: Number, default: 100 },
    reactedWiseUsers: { type: String, default: "" },
    reactedHelpfulUsers: { type: String, default: "" },
    reactedInspiringUsers: { type: String, default: "" }
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

PostSchema.index({ timestamp: -1 });

PostSchema.pre<IPost>('save', async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue('post_id');
  }
  next();
});

export const Post = model<IPost>('Post', PostSchema);
