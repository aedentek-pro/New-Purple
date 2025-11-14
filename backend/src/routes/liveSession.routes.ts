import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createLiveSession,
  deleteLiveSession,
  getLiveSessionById,
  getLiveSessions,
  updateLiveSession,
} from '../controllers/liveSession.controller';

const router = Router();

const feedbackValidators = [
  body('feedback').optional().isArray(),
  body('feedback.*.studentId').optional().isMongoId(),
  body('feedback.*.rating').optional().isFloat({ min: 1, max: 5 }),
  body('feedback.*.comment').optional().isString(),
];

const sessionValidators = [
  body('title').isString().withMessage('Title is required'),
  body('description').isString().withMessage('Description is required'),
  body('instructor').isMongoId().withMessage('Instructor must be a valid user ID'),
  body('dateTime').isISO8601().withMessage('dateTime must be a valid ISO date'),
  body('endTime').isISO8601().withMessage('endTime must be a valid ISO date'),
  body('price').optional().isFloat({ min: 0 }),
  body('attendees').optional().isArray(),
  body('attendees.*').optional().isMongoId(),
  body('recordingUrl').optional().isString(),
  body('reminderSent').optional().isBoolean(),
  body('quiz').optional().isMongoId(),
  ...feedbackValidators,
];

router.get('/', getLiveSessions);
router.get('/:id', [param('id').isMongoId()], getLiveSessionById);
router.post('/', sessionValidators, createLiveSession);
router.put('/:id', [param('id').isMongoId(), ...sessionValidators], updateLiveSession);
router.delete('/:id', [param('id').isMongoId()], deleteLiveSession);

export default router;

