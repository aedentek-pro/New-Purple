import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { LiveSessionModel } from '../models/LiveSession';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

const parseDateValue = (value?: string | Date): Date | undefined => {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value;
  }
  const parsed = new Date(value);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (Number.isNaN(parsed.getTime())) {
    throw new HttpError(400, `Invalid date value provided: ${value}`);
  }
  return parsed;
};

export const getLiveSessions = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.instructorId === 'string') {
    filters.instructor = req.query.instructorId;
  }
  if (typeof req.query.upcoming === 'string' && req.query.upcoming === 'true') {
    filters.dateTime = { $gte: new Date() };
  }
  const sessions = await LiveSessionModel.find(filters)
    .populate('instructor')
    .populate('attendees')
    .populate('quiz');
  res.json(createSuccessResponse(sessions));
});

export const getLiveSessionById = asyncHandler(async (req: Request, res: Response) => {
  const session = await LiveSessionModel.findById(req.params.id)
    .populate('instructor')
    .populate('attendees')
    .populate('quiz');
  if (!session) {
    throw new HttpError(404, 'Live session not found');
  }
  res.json(createSuccessResponse(session));
});

export const createLiveSession = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const payload = {
    ...req.body,
    dateTime: parseDateValue(req.body.dateTime),
    endTime: parseDateValue(req.body.endTime),
  };
  const session = await LiveSessionModel.create(payload);
  res.status(201).json(createSuccessResponse(session, 'Live session created successfully'));
});

export const updateLiveSession = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const payload: Record<string, unknown> = { ...req.body };
  if (req.body.dateTime) {
    payload.dateTime = parseDateValue(req.body.dateTime);
  }
  if (req.body.endTime) {
    payload.endTime = parseDateValue(req.body.endTime);
  }
  const session = await LiveSessionModel.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('instructor')
    .populate('attendees')
    .populate('quiz');
  if (!session) {
    throw new HttpError(404, 'Live session not found');
  }
  res.json(createSuccessResponse(session, 'Live session updated successfully'));
});

export const deleteLiveSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await LiveSessionModel.findByIdAndDelete(req.params.id);
  if (!session) {
    throw new HttpError(404, 'Live session not found');
  }
  res.json(createSuccessResponse(session, 'Live session deleted successfully'));
});

