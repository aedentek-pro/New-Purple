"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const quiz_controller_1 = require("../controllers/quiz.controller");
const router = (0, express_1.Router)();
const quizValidators = [
    (0, express_validator_1.body)('title').isString().withMessage('Quiz title is required'),
    (0, express_validator_1.body)('questions').isArray({ min: 1 }).withMessage('Quiz must include at least one question'),
    (0, express_validator_1.body)('questions.*.text').isString().withMessage('Question text is required'),
    (0, express_validator_1.body)('questions.*.options')
        .isArray({ min: 2 })
        .withMessage('Each question must include at least two options'),
    (0, express_validator_1.body)('questions.*.correctAnswerIndex')
        .isInt({ min: 0 })
        .withMessage('Correct answer index must be a non-negative integer'),
    (0, express_validator_1.body)('course').optional().isMongoId().withMessage('Course must be a valid Mongo ID'),
];
router.get('/', quiz_controller_1.getQuizzes);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], quiz_controller_1.getQuizById);
router.post('/', quizValidators, quiz_controller_1.createQuiz);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...quizValidators], quiz_controller_1.updateQuiz);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], quiz_controller_1.deleteQuiz);
exports.default = router;
