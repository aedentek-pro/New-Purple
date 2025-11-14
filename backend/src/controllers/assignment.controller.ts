import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AssignmentModel } from '../models/Assignment';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getAssignments = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.courseId === 'string') {
    filters.course = req.query.courseId;
  }
  const assignments = await AssignmentModel.find(filters).populate('course');
  res.json(createSuccessResponse(assignments));
});

export const getAssignmentById = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await AssignmentModel.findById(req.params.id).populate('course');
  if (!assignment) {
    throw new HttpError(404, 'Assignment not found');
  }
  res.json(createSuccessResponse(assignment));
});

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const assignment = await AssignmentModel.create(req.body);
  res.status(201).json(createSuccessResponse(assignment, 'Assignment created successfully'));
});

export const updateAssignment = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const assignment = await AssignmentModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('course');
  if (!assignment) {
    throw new HttpError(404, 'Assignment not found');
  }
  res.json(createSuccessResponse(assignment, 'Assignment updated successfully'));
});

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await AssignmentModel.findByIdAndDelete(req.params.id);
  if (!assignment) {
    throw new HttpError(404, 'Assignment not found');
  }
  res.json(createSuccessResponse(assignment, 'Assignment deleted successfully'));
});

