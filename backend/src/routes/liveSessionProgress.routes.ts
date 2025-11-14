import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createLiveSessionProgress,
  deleteLiveSessionProgress,
  getLiveSessionProgressById,
  getLiveSessionProgressList,
  updateLiveSessionProgress,
} from '../controllers/liveSessionProgress.controller';

const router = Router();

const progressValidators = [
  body('session').isMongoId().withMessage('Session is required'),
  body('student').isMongoId().withMessage('Student is required'),
  body('quizScore').optional().isFloat({ min: 0 }).withMessage('Quiz score must be positive'),
];

router.get('/', getLiveSessionProgressList);
router.get('/:id', [param('id').isMongoId()], getLiveSessionProgressById);
router.post('/', progressValidators, createLiveSessionProgress);
router.put('/:id', [param('id').isMongoId(), ...progressValidators], updateLiveSessionProgress);
router.delete('/:id', [param('id').isMongoId()], deleteLiveSessionProgress);

export default router;

