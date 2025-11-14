import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { CourseModel } from '../models/Course';
import { QuizModel } from '../models/Quiz';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.instructorId === 'string') {
    filters.instructor = req.query.instructorId;
  }
  if (typeof req.query.category === 'string') {
    filters.category = req.query.category;
  }
  if (typeof req.query.difficulty === 'string') {
    filters.difficulty = req.query.difficulty;
  }

  const courses = await CourseModel.find(filters)
    .populate('instructor')
    .populate('quiz');
  res.json(createSuccessResponse(courses));
});

export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
  const course = await CourseModel.findById(req.params.id).populate('instructor').populate('quiz');
  if (!course) {
    throw new HttpError(404, 'Course not found');
  }
  res.json(createSuccessResponse(course));
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }

  const { quizId, quiz, ...coursePayload } = req.body;
  let quizObjectId = quizId;

  if (quiz && !quizId) {
    const createdQuiz = await QuizModel.create(quiz);
    quizObjectId = createdQuiz._id;
  } else if (quizId) {
    const existingQuiz = await QuizModel.findById(quizId);
    if (!existingQuiz) {
      throw new HttpError(404, 'Linked quiz not found');
    }
  }

  const course = await CourseModel.create({
    ...coursePayload,
    quiz: quizObjectId,
  });

  if (quizObjectId) {
    await QuizModel.findByIdAndUpdate(quizObjectId, { course: course._id });
  }

  res.status(201).json(createSuccessResponse(course, 'Course created successfully'));
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }

  const { quizId, quiz, ...coursePayload } = req.body;
  let quizObjectId = quizId;

  if (quiz) {
    if (quizId) {
      const updatedQuiz = await QuizModel.findByIdAndUpdate(quizId, quiz, { new: true, runValidators: true });
      if (!updatedQuiz) {
        throw new HttpError(404, 'Linked quiz not found');
      }
    } else {
      const createdQuiz = await QuizModel.create(quiz);
      quizObjectId = createdQuiz._id;
    }
  }

  const course = await CourseModel.findByIdAndUpdate(
    req.params.id,
    { ...coursePayload, quiz: quizObjectId },
    { new: true, runValidators: true },
  )
    .populate('instructor')
    .populate('quiz');

  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  if (course.quiz) {
    const quizId = (() => {
      if (typeof course.quiz === 'string') {
        return course.quiz;
      }
      if (course.quiz instanceof Types.ObjectId) {
        return course.quiz.toString();
      }
      if (typeof (course.quiz as { _id?: Types.ObjectId })._id !== 'undefined') {
        const value = (course.quiz as { _id?: Types.ObjectId })._id;
        return value instanceof Types.ObjectId ? value.toString() : value;
      }
      return undefined;
    })();
    if (quizId) {
      await QuizModel.findByIdAndUpdate(quizId, { course: course._id });
    }
  }

  res.json(createSuccessResponse(course, 'Course updated successfully'));
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await CourseModel.findByIdAndDelete(req.params.id);
  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  if (course.quiz) {
    await QuizModel.findByIdAndUpdate(course.quiz, { course: null });
  }

  res.json(createSuccessResponse(course, 'Course deleted successfully'));
});

