import { Schema, Types, model } from 'mongoose';

export interface Question {
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
  course?: Types.ObjectId;
}

const questionSchema = new Schema<Question>(
  {
    text: { type: String, required: true },
    options: { type: [String], required: true, validate: (v: string[]) => v.length >= 2 },
    correctAnswerIndex: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const quizSchema = new Schema<Quiz>(
  {
    title: { type: String, required: true },
    questions: { type: [questionSchema], default: [] },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
  },
  { timestamps: true },
);

export const QuizModel = model<Quiz>('Quiz', quizSchema);

