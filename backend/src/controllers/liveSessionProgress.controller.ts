import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { LiveSessionProgressModel } from '../models/LiveSessionProgress';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getLiveSessionProgressList = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.sessionId === 'string') {
    filters.session = req.query.sessionId;
  }
  if (typeof req.query.studentId === 'string') {
    filters.student = req.query.studentId;
  }
  const progress = await LiveSessionProgressModel.find(filters).populate('session').populate('student');
  res.json(createSuccessResponse(progress));
});

export const getLiveSessionProgressById = asyncHandler(async (req: Request, res: Response) => {
  const progress = await LiveSessionProgressModel.findById(req.params.id)
    .populate('session')
    .populate('student');
  if (!progress) {
    throw new HttpError(404, 'Live session progress record not found');
  }
  res.json(createSuccessResponse(progress));
});

export const createLiveSessionProgress = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const progress = await LiveSessionProgressModel.create(req.body);
  res.status(201).json(createSuccessResponse(progress, 'Live session progress created successfully'));
});

export const updateLiveSessionProgress = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const progress = await LiveSessionProgressModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('session')
    .populate('student');
  if (!progress) {
    throw new HttpError(404, 'Live session progress record not found');
  }
  res.json(createSuccessResponse(progress, 'Live session progress updated successfully'));
});

export const deleteLiveSessionProgress = asyncHandler(async (req: Request, res: Response) => {
  const progress = await LiveSessionProgressModel.findByIdAndDelete(req.params.id);
  if (!progress) {
    throw new HttpError(404, 'Live session progress record not found');
  }
  res.json(createSuccessResponse(progress, 'Live session progress deleted successfully'));
});

