import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createOneToOneSession,
  deleteOneToOneSession,
  getOneToOneSessionById,
  getOneToOneSessions,
  updateOneToOneSession,
} from '../controllers/oneToOneSession.controller';

const router = Router();

const statusOptions = ['pending', 'scheduled', 'completed', 'canceled', 'rejected'];

const sessionValidators = [
  body('student').isMongoId().withMessage('Student is required'),
  body('instructor').isMongoId().withMessage('Instructor is required'),
  body('requestedBy').isMongoId().withMessage('RequestedBy is required'),
  body('dateTime').isISO8601().withMessage('dateTime must be a valid ISO date'),
  body('status').optional().isIn(statusOptions).withMessage(`Status must be one of: ${statusOptions.join(', ')}`),
  body('reminderSent').optional().isBoolean(),
  body('rating').optional().isFloat({ min: 1, max: 5 }),
  body('feedback').optional().isString(),
];

router.get('/', getOneToOneSessions);
router.get('/:id', [param('id').isMongoId()], getOneToOneSessionById);
router.post('/', sessionValidators, createOneToOneSession);
router.put('/:id', [param('id').isMongoId(), ...sessionValidators], updateOneToOneSession);
router.delete('/:id', [param('id').isMongoId()], deleteOneToOneSession);

export default router;

