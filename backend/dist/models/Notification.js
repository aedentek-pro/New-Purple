"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    recipient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
        type: String,
        enum: ['system', 'course', 'certificate', 'session', 'announcement'],
        required: true,
    },
    link: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.NotificationModel = (0, mongoose_1.model)('Notification', notificationSchema);
