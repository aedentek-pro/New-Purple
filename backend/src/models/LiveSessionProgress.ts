import { Schema, Types, model } from 'mongoose';

export interface LiveSessionProgress {
  session: Types.ObjectId;
  student: Types.ObjectId;
  quizScore: number | null;
}

const liveSessionProgressSchema = new Schema<LiveSessionProgress>(
  {
    session: { type: Schema.Types.ObjectId, ref: 'LiveSession', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quizScore: { type: Number, default: null },
  },
  { timestamps: true },
);

liveSessionProgressSchema.index({ session: 1, student: 1 }, { unique: true });

export const LiveSessionProgressModel = model<LiveSessionProgress>(
  'LiveSessionProgress',
  liveSessionProgressSchema,
);

