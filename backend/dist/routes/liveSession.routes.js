"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const liveSession_controller_1 = require("../controllers/liveSession.controller");
const router = (0, express_1.Router)();
const feedbackValidators = [
    (0, express_validator_1.body)('feedback').optional().isArray(),
    (0, express_validator_1.body)('feedback.*.studentId').optional().isMongoId(),
    (0, express_validator_1.body)('feedback.*.rating').optional().isFloat({ min: 1, max: 5 }),
    (0, express_validator_1.body)('feedback.*.comment').optional().isString(),
];
const sessionValidators = [
    (0, express_validator_1.body)('title').isString().withMessage('Title is required'),
    (0, express_validator_1.body)('description').isString().withMessage('Description is required'),
    (0, express_validator_1.body)('instructor').isMongoId().withMessage('Instructor must be a valid user ID'),
    (0, express_validator_1.body)('dateTime').isISO8601().withMessage('dateTime must be a valid ISO date'),
    (0, express_validator_1.body)('endTime').isISO8601().withMessage('endTime must be a valid ISO date'),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('attendees').optional().isArray(),
    (0, express_validator_1.body)('attendees.*').optional().isMongoId(),
    (0, express_validator_1.body)('recordingUrl').optional().isString(),
    (0, express_validator_1.body)('reminderSent').optional().isBoolean(),
    (0, express_validator_1.body)('quiz').optional().isMongoId(),
    ...feedbackValidators,
];
router.get('/', liveSession_controller_1.getLiveSessions);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], liveSession_controller_1.getLiveSessionById);
router.post('/', sessionValidators, liveSession_controller_1.createLiveSession);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...sessionValidators], liveSession_controller_1.updateLiveSession);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], liveSession_controller_1.deleteLiveSession);
exports.default = router;
