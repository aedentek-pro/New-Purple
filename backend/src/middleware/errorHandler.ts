import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validator';
import { createErrorResponse } from '../utils/apiResponse';

interface CustomError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  const payload = createErrorResponse(err.message || 'Internal Server Error');
  if (err.errors) {
    payload.message = `${payload.message}. ${err.errors.map((e) => e.msg).join(', ')}`;
  }
  res.status(statusCode).json(payload);
};

