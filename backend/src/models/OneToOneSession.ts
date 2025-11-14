import { Schema, Types, model } from 'mongoose';

export type OneToOneStatus = 'pending' | 'scheduled' | 'completed' | 'canceled' | 'rejected';

export interface OneToOneSession {
  student: Types.ObjectId;
  instructor: Types.ObjectId;
  dateTime: Date;
  status: OneToOneStatus;
  requestedBy: Types.ObjectId;
  reminderSent?: boolean;
  rating?: number;
  feedback?: string;
}

const oneToOneSessionSchema = new Schema<OneToOneSession>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'canceled', 'rejected'],
      default: 'pending',
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reminderSent: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
  },
  { timestamps: true },
);

export const OneToOneSessionModel = model<OneToOneSession>('OneToOneSession', oneToOneSessionSchema);

