import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ChatMessageModel } from '../models/ChatMessage';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getChatMessages = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.userId === 'string') {
    filters.user = req.query.userId;
  }
  const messages = await ChatMessageModel.find(filters)
    .populate('user')
    .sort({ createdAt: -1 });
  res.json(createSuccessResponse(messages));
});

export const getChatMessageById = asyncHandler(async (req: Request, res: Response) => {
  const message = await ChatMessageModel.findById(req.params.id).populate('user');
  if (!message) {
    throw new HttpError(404, 'Chat message not found');
  }
  res.json(createSuccessResponse(message));
});

export const createChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const timestamp =
    req.body.timestamp && typeof req.body.timestamp === 'string'
      ? new Date(req.body.timestamp)
      : req.body.timestamp instanceof Date
        ? req.body.timestamp
        : new Date();
  const message = await ChatMessageModel.create({ ...req.body, timestamp });
  res.status(201).json(createSuccessResponse(message, 'Chat message created successfully'));
});

export const updateChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const message = await ChatMessageModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('user');
  if (!message) {
    throw new HttpError(404, 'Chat message not found');
  }
  res.json(createSuccessResponse(message, 'Chat message updated successfully'));
});

export const deleteChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ChatMessageModel.findByIdAndDelete(req.params.id);
  if (!message) {
    throw new HttpError(404, 'Chat message not found');
  }
  res.json(createSuccessResponse(message, 'Chat message deleted successfully'));
});

