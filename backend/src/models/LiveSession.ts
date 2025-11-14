import { Schema, Types, model } from 'mongoose';

export interface SessionFeedback {
  studentId: Types.ObjectId;
  rating: number;
  comment: string;
}

export interface LiveSession {
  title: string;
  description: string;
  instructor: Types.ObjectId;
  dateTime: Date;
  endTime: Date;
  price?: number;
  attendees: Types.ObjectId[];
  recordingUrl?: string;
  reminderSent?: boolean;
  feedback?: SessionFeedback[];
  quiz?: Types.ObjectId;
}

const sessionFeedbackSchema = new Schema<SessionFeedback>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { _id: false },
);

const liveSessionSchema = new Schema<LiveSession>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number },
    attendees: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    recordingUrl: { type: String },
    reminderSent: { type: Boolean, default: false },
    feedback: { type: [sessionFeedbackSchema], default: [] },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  },
  { timestamps: true },
);

export const LiveSessionModel = model<LiveSession>('LiveSession', liveSessionSchema);

