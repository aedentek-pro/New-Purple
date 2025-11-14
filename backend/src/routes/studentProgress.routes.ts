import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createStudentProgress,
  deleteStudentProgress,
  getStudentProgressById,
  getStudentProgressList,
  updateStudentProgress,
} from '../controllers/studentProgress.controller';

const router = Router();

const assignmentStatusOptions = ['pending', 'submitted', 'graded'];

const progressValidators = [
  body('course').isMongoId().withMessage('Course is required'),
  body('student').isMongoId().withMessage('Student is required'),
  body('completedModules').optional().isArray().withMessage('Completed modules must be an array'),
  body('completedModules.*').optional().isMongoId().withMessage('Completed module IDs must be valid'),
  body('quizScore').optional().isFloat({ min: 0 }).withMessage('Quiz score must be positive'),
  body('assignmentStatus')
    .isIn(assignmentStatusOptions)
    .withMessage(`Assignment status must be one of: ${assignmentStatusOptions.join(', ')}`),
  body('rating').optional().isFloat({ min: 1, max: 5 }),
  body('completionNotified').optional().isBoolean(),
  body('certificateIssued').optional().isBoolean(),
];

router.get('/', getStudentProgressList);
router.get('/:id', [param('id').isMongoId()], getStudentProgressById);
router.post('/', progressValidators, createStudentProgress);
router.put('/:id', [param('id').isMongoId(), ...progressValidators], updateStudentProgress);
router.delete('/:id', [param('id').isMongoId()], deleteStudentProgress);

export default router;

