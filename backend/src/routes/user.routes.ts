import { Router } from 'express';
import { body, param } from 'express-validator';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/user.controller';
import { UserRole } from '../models/User';

const router = Router();

const createOrUpdateUserValidators = [
  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role')
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
  body('password')
    .if((_value, { req }) => req.method === 'POST')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('password')
    .if((_value, { req }) => req.method === 'PUT')
    .optional()
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').optional().isString(),
  body('address').optional().isString(),
];

router.get('/', getUsers);
router.get('/:id', [param('id').isMongoId()], getUserById);
router.post('/', createOrUpdateUserValidators, createUser);
router.put('/:id', [param('id').isMongoId(), ...createOrUpdateUserValidators], updateUser);
router.delete('/:id', [param('id').isMongoId()], deleteUser);

export default router;

