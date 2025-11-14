import { Schema, Types, model } from 'mongoose';

export interface StudentProgress {
  course: Types.ObjectId;
  student: Types.ObjectId;
  completedModules: Types.ObjectId[];
  quizScore: number | null;
  assignmentStatus: 'pending' | 'submitted' | 'graded';
  rating?: number;
  completionNotified?: boolean;
  certificateIssued?: boolean;
}

const studentProgressSchema = new Schema<StudentProgress>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    completedModules: { type: [Schema.Types.ObjectId], default: [] },
    quizScore: { type: Number, default: null },
    assignmentStatus: {
      type: String,
      enum: ['pending', 'submitted', 'graded'],
      default: 'pending',
    },
    rating: { type: Number },
    completionNotified: { type: Boolean, default: false },
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true },
);

studentProgressSchema.index({ course: 1, student: 1 }, { unique: true });

export const StudentProgressModel = model<StudentProgress>('StudentProgress', studentProgressSchema);

