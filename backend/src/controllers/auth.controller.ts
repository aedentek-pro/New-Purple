import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';
import { generateToken } from '../utils/jwt';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sanitizeUser = (user: InstanceType<typeof UserModel>) => user.toJSON();

export const checkEmailAvailability = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const email = normalizeEmail((req.query.email as string) ?? '');
  if (!email) {
    throw new HttpError(400, 'Email query parameter is required');
  }

  const existingUser = await UserModel.findOne({ email });
  res.json(
    createSuccessResponse({
      exists: Boolean(existingUser),
    }),
  );
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }

  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role: string;
  };

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await UserModel.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new HttpError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    name,
    email: normalizedEmail,
    role,
    passwordHash,
  });

  const token = generateToken({ sub: user.id, role: user.role });

  res.status(201).json(
    createSuccessResponse(
      {
        user: sanitizeUser(user),
        token,
      },
      'Account created successfully',
    ),
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }

  const { email, password } = req.body as { email: string; password: string };
  const normalizedEmail = normalizeEmail(email);

  const user = await UserModel.findOne({ email: normalizedEmail });
  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = generateToken({ sub: user.id, role: user.role });

  res.json(
    createSuccessResponse(
      {
        user: sanitizeUser(user),
        token,
      },
      'Login successful',
    ),
  );
});


