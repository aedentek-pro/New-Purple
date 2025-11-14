"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const course_controller_1 = require("../controllers/course.controller");
const router = (0, express_1.Router)();
const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
const moduleValidators = [
    (0, express_validator_1.body)('modules').optional().isArray().withMessage('Modules must be an array'),
    (0, express_validator_1.body)('modules.*.title').optional().isString().withMessage('Module title must be a string'),
    (0, express_validator_1.body)('modules.*.type')
        .optional()
        .isIn(['text', 'video'])
        .withMessage('Module type must be either "text" or "video"'),
    (0, express_validator_1.body)('modules.*.content').optional().isString().withMessage('Module content must be a string'),
    (0, express_validator_1.body)('modules.*.durationMinutes')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Module duration must be a positive integer'),
];
const quizValidators = [
    (0, express_validator_1.body)('quizId').optional().isMongoId().withMessage('quizId must be a valid Mongo ID'),
    (0, express_validator_1.body)('quiz')
        .optional()
        .isObject()
        .withMessage('Quiz must be an object'),
    (0, express_validator_1.body)('quiz.title').optional().isString().withMessage('Quiz title must be a string'),
    (0, express_validator_1.body)('quiz.questions').optional().isArray().withMessage('Quiz questions must be an array'),
    (0, express_validator_1.body)('quiz.questions.*.text').optional().isString().withMessage('Question text must be a string'),
    (0, express_validator_1.body)('quiz.questions.*.options')
        .optional()
        .isArray({ min: 2 })
        .withMessage('Question options must include at least two choices'),
    (0, express_validator_1.body)('quiz.questions.*.correctAnswerIndex')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Correct answer index must be a number'),
];
const createOrUpdateCourseValidators = [
    (0, express_validator_1.body)('title').isString().withMessage('Title is required'),
    (0, express_validator_1.body)('description').isString().withMessage('Description is required'),
    (0, express_validator_1.body)('instructor').isMongoId().withMessage('Instructor must be a valid user ID'),
    (0, express_validator_1.body)('thumbnailUrl').isString().withMessage('Thumbnail URL is required'),
    (0, express_validator_1.body)('category').isString().withMessage('Category is required'),
    (0, express_validator_1.body)('difficulty')
        .isIn(difficultyOptions)
        .withMessage(`Difficulty must be one of: ${difficultyOptions.join(', ')}`),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }),
    ...moduleValidators,
    ...quizValidators,
];
router.get('/', course_controller_1.getCourses);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], course_controller_1.getCourseById);
router.post('/', createOrUpdateCourseValidators, course_controller_1.createCourse);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...createOrUpdateCourseValidators], course_controller_1.updateCourse);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], course_controller_1.deleteCourse);
exports.default = router;
