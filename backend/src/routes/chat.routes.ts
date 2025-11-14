import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createChatMessage,
  deleteChatMessage,
  getChatMessageById,
  getChatMessages,
  updateChatMessage,
} from '../controllers/chat.controller';

const router = Router();

const chatValidators = [
  body('user').isMongoId().withMessage('User is required'),
  body('text').isString().withMessage('Text content is required'),
  body('timestamp').optional().isISO8601().withMessage('Timestamp must be a valid date'),
];

router.get('/', getChatMessages);
router.get('/:id', [param('id').isMongoId()], getChatMessageById);
router.post('/', chatValidators, createChatMessage);
router.put('/:id', [param('id').isMongoId(), ...chatValidators], updateChatMessage);
router.delete('/:id', [param('id').isMongoId()], deleteChatMessage);

export default router;

