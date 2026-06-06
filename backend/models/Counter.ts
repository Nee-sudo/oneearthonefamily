import { Schema, model, Document } from 'mongoose';

export interface ICounter extends Document {
  id: string; // e.g., 'post_id', 'comment_id', etc.
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

export const Counter = model<ICounter>('Counter', CounterSchema);

export const getNextSequenceValue = async (sequenceName: string): Promise<number> => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
};
