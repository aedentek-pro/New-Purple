import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { NotificationModel } from '../models/Notification';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.recipientId === 'string') {
    filters.recipient = req.query.recipientId;
  }
  if (typeof req.query.type === 'string') {
    filters.type = req.query.type;
  }
  const notifications = await NotificationModel.find(filters).sort({ createdAt: -1 }).populate('recipient');
  res.json(createSuccessResponse(notifications));
});

export const getNotificationById = asyncHandler(async (req: Request, res: Response) => {
  const notification = await NotificationModel.findById(req.params.id).populate('recipient');
  if (!notification) {
    throw new HttpError(404, 'Notification not found');
  }
  res.json(createSuccessResponse(notification));
});

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const notification = await NotificationModel.create(req.body);
  res.status(201).json(createSuccessResponse(notification, 'Notification created successfully'));
});

export const updateNotification = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const notification = await NotificationModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('recipient');
  if (!notification) {
    throw new HttpError(404, 'Notification not found');
  }
  res.json(createSuccessResponse(notification, 'Notification updated successfully'));
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const notification = await NotificationModel.findByIdAndDelete(req.params.id);
  if (!notification) {
    throw new HttpError(404, 'Notification not found');
  }
  res.json(createSuccessResponse(notification, 'Notification deleted successfully'));
});

