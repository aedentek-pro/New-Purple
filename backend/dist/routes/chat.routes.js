"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
const chatValidators = [
    (0, express_validator_1.body)('user').isMongoId().withMessage('User is required'),
    (0, express_validator_1.body)('text').isString().withMessage('Text content is required'),
    (0, express_validator_1.body)('timestamp').optional().isISO8601().withMessage('Timestamp must be a valid date'),
];
router.get('/', chat_controller_1.getChatMessages);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], chat_controller_1.getChatMessageById);
router.post('/', chatValidators, chat_controller_1.createChatMessage);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...chatValidators], chat_controller_1.updateChatMessage);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], chat_controller_1.deleteChatMessage);
exports.default = router;
