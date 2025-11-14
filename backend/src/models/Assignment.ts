import { Schema, Types, model } from 'mongoose';

export interface Assignment {
  course: Types.ObjectId;
  title: string;
  prompt: string;
}

const assignmentSchema = new Schema<Assignment>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
  },
  { timestamps: true },
);

export const AssignmentModel = model<Assignment>('Assignment', assignmentSchema);

