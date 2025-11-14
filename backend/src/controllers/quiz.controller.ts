import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { QuizModel } from '../models/Quiz';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getQuizzes = asyncHandler(async (_req: Request, res: Response) => {
  const quizzes = await QuizModel.find().populate('course');
  res.json(createSuccessResponse(quizzes));
});

export const getQuizById = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await QuizModel.findById(req.params.id).populate('course');
  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }
  res.json(createSuccessResponse(quiz));
});

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const quiz = await QuizModel.create(req.body);
  res.status(201).json(createSuccessResponse(quiz, 'Quiz created successfully'));
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const quiz = await QuizModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }
  res.json(createSuccessResponse(quiz, 'Quiz updated successfully'));
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await QuizModel.findByIdAndDelete(req.params.id);
  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }
  res.json(createSuccessResponse(quiz, 'Quiz deleted successfully'));
});

