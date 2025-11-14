import { ValidationError } from 'express-validator';

export class HttpError extends Error {
  statusCode: number;
  errors?: ValidationError[];

  constructor(statusCode: number, message: string, errors?: ValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

