import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
} from '../controllers/notification.controller';

const router = Router();

const notificationTypes = ['system', 'course', 'certificate', 'session', 'announcement'];

const notificationValidators = [
  body('recipient').isMongoId().withMessage('Recipient is required'),
  body('message').isString().withMessage('Message is required'),
  body('type')
    .isIn(notificationTypes)
    .withMessage(`Notification type must be one of: ${notificationTypes.join(', ')}`),
  body('read').optional().isBoolean(),
  body('link').optional().isString(),
];

router.get('/', getNotifications);
router.get('/:id', [param('id').isMongoId()], getNotificationById);
router.post('/', notificationValidators, createNotification);
router.put('/:id', [param('id').isMongoId(), ...notificationValidators], updateNotification);
router.delete('/:id', [param('id').isMongoId()], deleteNotification);

export default router;

