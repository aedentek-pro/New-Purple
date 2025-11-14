import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignments,
  updateAssignment,
} from '../controllers/assignment.controller';

const router = Router();

const assignmentValidators = [
  body('course').isMongoId().withMessage('Course is required'),
  body('title').isString().withMessage('Title is required'),
  body('prompt').isString().withMessage('Prompt is required'),
];

router.get('/', getAssignments);
router.get('/:id', [param('id').isMongoId()], getAssignmentById);
router.post('/', assignmentValidators, createAssignment);
router.put('/:id', [param('id').isMongoId(), ...assignmentValidators], updateAssignment);
router.delete('/:id', [param('id').isMongoId()], deleteAssignment);

export default router;

