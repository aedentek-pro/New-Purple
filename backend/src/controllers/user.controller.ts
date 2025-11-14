import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find();
  res.json(createSuccessResponse(users));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  res.json(createSuccessResponse(user));
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }

  // Normalize email to lowercase
  const normalizedEmail = req.body.email.toLowerCase().trim();

  // Check if user with this email already exists
  const existingUser = await UserModel.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new HttpError(409, 'An account with this email already exists.');
  }

  const { password, ...rest } = req.body as Record<string, unknown> & { password?: string };
  if (!password) {
    throw new HttpError(400, 'Password is required');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    ...rest,
    email: normalizedEmail,
    passwordHash,
  });
  res.status(201).json(createSuccessResponse(user, 'User created successfully'));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }

  const updateData: Record<string, unknown> = { ...req.body };
  if (updateData.email && typeof updateData.email === 'string') {
    updateData.email = updateData.email.toLowerCase().trim();
  }

  if (updateData.password && typeof updateData.password === 'string') {
    updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
    delete updateData.password;
  }

  const user = await UserModel.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  res.json(createSuccessResponse(user, 'User updated successfully'));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  res.json(createSuccessResponse(user, 'User deleted successfully'));
});

