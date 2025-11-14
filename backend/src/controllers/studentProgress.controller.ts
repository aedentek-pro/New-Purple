import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StudentProgressModel } from '../models/StudentProgress';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getStudentProgressList = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.studentId === 'string') {
    filters.student = req.query.studentId;
  }
  if (typeof req.query.courseId === 'string') {
    filters.course = req.query.courseId;
  }
  const progress = await StudentProgressModel.find(filters).populate('student').populate('course');
  res.json(createSuccessResponse(progress));
});

export const getStudentProgressById = asyncHandler(async (req: Request, res: Response) => {
  const progress = await StudentProgressModel.findById(req.params.id).populate('student').populate('course');
  if (!progress) {
    throw new HttpError(404, 'Student progress record not found');
  }
  res.json(createSuccessResponse(progress));
});

export const createStudentProgress = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const progress = await StudentProgressModel.create(req.body);
  res.status(201).json(createSuccessResponse(progress, 'Student progress created successfully'));
});

export const updateStudentProgress = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const progress = await StudentProgressModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('student')
    .populate('course');
  if (!progress) {
    throw new HttpError(404, 'Student progress record not found');
  }
  res.json(createSuccessResponse(progress, 'Student progress updated successfully'));
});

export const deleteStudentProgress = asyncHandler(async (req: Request, res: Response) => {
  const progress = await StudentProgressModel.findByIdAndDelete(req.params.id);
  if (!progress) {
    throw new HttpError(404, 'Student progress record not found');
  }
  res.json(createSuccessResponse(progress, 'Student progress deleted successfully'));
});

