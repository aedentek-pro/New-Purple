import { Schema, Types, model } from 'mongoose';
import { Quiz } from './Quiz';

export type ModuleType = 'text' | 'video';

export interface Module {
  title: string;
  type: ModuleType;
  content: string;
  durationMinutes: number;
}

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  title: string;
  description: string;
  instructor: Types.ObjectId;
  thumbnailUrl: string;
  modules: Module[];
  quiz?: Types.ObjectId | Quiz;
  rating?: number;
  totalRatings?: number;
  price?: number;
  category: string;
  difficulty: CourseDifficulty;
}

const moduleSchema = new Schema<Module>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'video'], required: true },
    content: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
  },
  { _id: true },
);

const courseSchema = new Schema<Course>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnailUrl: { type: String, required: true },
    modules: { type: [moduleSchema], default: [] },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    price: { type: Number },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  },
  { timestamps: true },
);

export const CourseModel = model<Course>('Course', courseSchema);

