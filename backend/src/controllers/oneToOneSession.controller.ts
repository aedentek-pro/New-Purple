import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { OneToOneSessionModel } from '../models/OneToOneSession';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getOneToOneSessions = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.studentId === 'string') {
    filters.student = req.query.studentId;
  }
  if (typeof req.query.instructorId === 'string') {
    filters.instructor = req.query.instructorId;
  }
  if (typeof req.query.status === 'string') {
    filters.status = req.query.status;
  }
  const sessions = await OneToOneSessionModel.find(filters)
    .populate('student')
    .populate('instructor')
    .populate('requestedBy');
  res.json(createSuccessResponse(sessions));
});

export const getOneToOneSessionById = asyncHandler(async (req: Request, res: Response) => {
  const session = await OneToOneSessionModel.findById(req.params.id)
    .populate('student')
    .populate('instructor')
    .populate('requestedBy');
  if (!session) {
    throw new HttpError(404, 'One-to-one session not found');
  }
  res.json(createSuccessResponse(session));
});

export const createOneToOneSession = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const session = await OneToOneSessionModel.create(req.body);
  res.status(201).json(createSuccessResponse(session, 'One-to-one session created successfully'));
});

export const updateOneToOneSession = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const session = await OneToOneSessionModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('student')
    .populate('instructor')
    .populate('requestedBy');
  if (!session) {
    throw new HttpError(404, 'One-to-one session not found');
  }
  res.json(createSuccessResponse(session, 'One-to-one session updated successfully'));
});

export const deleteOneToOneSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await OneToOneSessionModel.findByIdAndDelete(req.params.id);
  if (!session) {
    throw new HttpError(404, 'One-to-one session not found');
  }
  res.json(createSuccessResponse(session, 'One-to-one session deleted successfully'));
});

