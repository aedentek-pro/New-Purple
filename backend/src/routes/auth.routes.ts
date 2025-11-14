import { Router } from 'express';
import { body, query } from 'express-validator';
import { checkEmailAvailability, login, signup } from '../controllers/auth.controller';
import { UserRole } from '../models/User';

const router = Router();

router.get(
  '/check-email',
  [query('email').isEmail().withMessage('Valid email is required')],
  checkEmailAvailability,
);

router.post(
  '/signup',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .isIn(Object.values(UserRole))
      .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
  ],
  signup,
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  login,
);

export default router;


