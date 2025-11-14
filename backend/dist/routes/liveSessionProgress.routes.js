"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const liveSessionProgress_controller_1 = require("../controllers/liveSessionProgress.controller");
const router = (0, express_1.Router)();
const progressValidators = [
    (0, express_validator_1.body)('session').isMongoId().withMessage('Session is required'),
    (0, express_validator_1.body)('student').isMongoId().withMessage('Student is required'),
    (0, express_validator_1.body)('quizScore').optional().isFloat({ min: 0 }).withMessage('Quiz score must be positive'),
];
router.get('/', liveSessionProgress_controller_1.getLiveSessionProgressList);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], liveSessionProgress_controller_1.getLiveSessionProgressById);
router.post('/', progressValidators, liveSessionProgress_controller_1.createLiveSessionProgress);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...progressValidators], liveSessionProgress_controller_1.updateLiveSessionProgress);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], liveSessionProgress_controller_1.deleteLiveSessionProgress);
exports.default = router;
