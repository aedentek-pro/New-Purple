import { Router } from 'express';
import { body, param } from 'express-validator';
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from '../controllers/course.controller';

const router = Router();

const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

const moduleValidators = [
  body('modules').optional().isArray().withMessage('Modules must be an array'),
  body('modules.*.title').optional().isString().withMessage('Module title must be a string'),
  body('modules.*.type')
    .optional()
    .isIn(['text', 'video'])
    .withMessage('Module type must be either "text" or "video"'),
  body('modules.*.content').optional().isString().withMessage('Module content must be a string'),
  body('modules.*.durationMinutes')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Module duration must be a positive integer'),
];

const quizValidators = [
  body('quizId').optional().isMongoId().withMessage('quizId must be a valid Mongo ID'),
  body('quiz')
    .optional()
    .isObject()
    .withMessage('Quiz must be an object'),
  body('quiz.title').optional().isString().withMessage('Quiz title must be a string'),
  body('quiz.questions').optional().isArray().withMessage('Quiz questions must be an array'),
  body('quiz.questions.*.text').optional().isString().withMessage('Question text must be a string'),
  body('quiz.questions.*.options')
    .optional()
    .isArray({ min: 2 })
    .withMessage('Question options must include at least two choices'),
  body('quiz.questions.*.correctAnswerIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Correct answer index must be a number'),
];

const createOrUpdateCourseValidators = [
  body('title').isString().withMessage('Title is required'),
  body('description').isString().withMessage('Description is required'),
  body('instructor').isMongoId().withMessage('Instructor must be a valid user ID'),
  body('thumbnailUrl').isString().withMessage('Thumbnail URL is required'),
  body('category').isString().withMessage('Category is required'),
  body('difficulty')
    .isIn(difficultyOptions)
    .withMessage(`Difficulty must be one of: ${difficultyOptions.join(', ')}`),
  body('price').optional().isFloat({ min: 0 }),
  ...moduleValidators,
  ...quizValidators,
];

router.get('/', getCourses);
router.get('/:id', [param('id').isMongoId()], getCourseById);
router.post('/', createOrUpdateCourseValidators, createCourse);
router.put('/:id', [param('id').isMongoId(), ...createOrUpdateCourseValidators], updateCourse);
router.delete('/:id', [param('id').isMongoId()], deleteCourse);

export default router;

