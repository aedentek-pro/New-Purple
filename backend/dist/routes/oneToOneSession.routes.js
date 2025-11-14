"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const oneToOneSession_controller_1 = require("../controllers/oneToOneSession.controller");
const router = (0, express_1.Router)();
const statusOptions = ['pending', 'scheduled', 'completed', 'canceled', 'rejected'];
const sessionValidators = [
    (0, express_validator_1.body)('student').isMongoId().withMessage('Student is required'),
    (0, express_validator_1.body)('instructor').isMongoId().withMessage('Instructor is required'),
    (0, express_validator_1.body)('requestedBy').isMongoId().withMessage('RequestedBy is required'),
    (0, express_validator_1.body)('dateTime').isISO8601().withMessage('dateTime must be a valid ISO date'),
    (0, express_validator_1.body)('status').optional().isIn(statusOptions).withMessage(`Status must be one of: ${statusOptions.join(', ')}`),
    (0, express_validator_1.body)('reminderSent').optional().isBoolean(),
    (0, express_validator_1.body)('rating').optional().isFloat({ min: 1, max: 5 }),
    (0, express_validator_1.body)('feedback').optional().isString(),
];
router.get('/', oneToOneSession_controller_1.getOneToOneSessions);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], oneToOneSession_controller_1.getOneToOneSessionById);
router.post('/', sessionValidators, oneToOneSession_controller_1.createOneToOneSession);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...sessionValidators], oneToOneSession_controller_1.updateOneToOneSession);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], oneToOneSession_controller_1.deleteOneToOneSession);
exports.default = router;
