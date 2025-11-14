import { Router } from 'express';
import { body, param } from 'express-validator';
import { createQuiz, deleteQuiz, getQuizById, getQuizzes, updateQuiz } from '../controllers/quiz.controller';

const router = Router();

const quizValidators = [
  body('title').isString().withMessage('Quiz title is required'),
  body('questions').isArray({ min: 1 }).withMessage('Quiz must include at least one question'),
  body('questions.*.text').isString().withMessage('Question text is required'),
  body('questions.*.options')
    .isArray({ min: 2 })
    .withMessage('Each question must include at least two options'),
  body('questions.*.correctAnswerIndex')
    .isInt({ min: 0 })
    .withMessage('Correct answer index must be a non-negative integer'),
  body('course').optional().isMongoId().withMessage('Course must be a valid Mongo ID'),
];

router.get('/', getQuizzes);
router.get('/:id', [param('id').isMongoId()], getQuizById);
router.post('/', quizValidators, createQuiz);
router.put('/:id', [param('id').isMongoId(), ...quizValidators], updateQuiz);
router.delete('/:id', [param('id').isMongoId()], deleteQuiz);

export default router;

