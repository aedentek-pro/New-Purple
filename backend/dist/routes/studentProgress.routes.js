"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const studentProgress_controller_1 = require("../controllers/studentProgress.controller");
const router = (0, express_1.Router)();
const assignmentStatusOptions = ['pending', 'submitted', 'graded'];
const progressValidators = [
    (0, express_validator_1.body)('course').isMongoId().withMessage('Course is required'),
    (0, express_validator_1.body)('student').isMongoId().withMessage('Student is required'),
    (0, express_validator_1.body)('completedModules').optional().isArray().withMessage('Completed modules must be an array'),
    (0, express_validator_1.body)('completedModules.*').optional().isMongoId().withMessage('Completed module IDs must be valid'),
    (0, express_validator_1.body)('quizScore').optional().isFloat({ min: 0 }).withMessage('Quiz score must be positive'),
    (0, express_validator_1.body)('assignmentStatus')
        .isIn(assignmentStatusOptions)
        .withMessage(`Assignment status must be one of: ${assignmentStatusOptions.join(', ')}`),
    (0, express_validator_1.body)('rating').optional().isFloat({ min: 1, max: 5 }),
    (0, express_validator_1.body)('completionNotified').optional().isBoolean(),
    (0, express_validator_1.body)('certificateIssued').optional().isBoolean(),
];
router.get('/', studentProgress_controller_1.getStudentProgressList);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], studentProgress_controller_1.getStudentProgressById);
router.post('/', progressValidators, studentProgress_controller_1.createStudentProgress);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...progressValidators], studentProgress_controller_1.updateStudentProgress);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], studentProgress_controller_1.deleteStudentProgress);
exports.default = router;
