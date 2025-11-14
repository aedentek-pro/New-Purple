"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
const notificationTypes = ['system', 'course', 'certificate', 'session', 'announcement'];
const notificationValidators = [
    (0, express_validator_1.body)('recipient').isMongoId().withMessage('Recipient is required'),
    (0, express_validator_1.body)('message').isString().withMessage('Message is required'),
    (0, express_validator_1.body)('type')
        .isIn(notificationTypes)
        .withMessage(`Notification type must be one of: ${notificationTypes.join(', ')}`),
    (0, express_validator_1.body)('read').optional().isBoolean(),
    (0, express_validator_1.body)('link').optional().isString(),
];
router.get('/', notification_controller_1.getNotifications);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], notification_controller_1.getNotificationById);
router.post('/', notificationValidators, notification_controller_1.createNotification);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...notificationValidators], notification_controller_1.updateNotification);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], notification_controller_1.deleteNotification);
exports.default = router;
