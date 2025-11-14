"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getNotificationById = exports.getNotifications = void 0;
const express_validator_1 = require("express-validator");
const Notification_1 = require("../models/Notification");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.recipientId === 'string') {
        filters.recipient = req.query.recipientId;
    }
    if (typeof req.query.type === 'string') {
        filters.type = req.query.type;
    }
    const notifications = await Notification_1.NotificationModel.find(filters).sort({ createdAt: -1 }).populate('recipient');
    res.json((0, apiResponse_1.createSuccessResponse)(notifications));
});
exports.getNotificationById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const notification = await Notification_1.NotificationModel.findById(req.params.id).populate('recipient');
    if (!notification) {
        throw new httpError_1.HttpError(404, 'Notification not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(notification));
});
exports.createNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const notification = await Notification_1.NotificationModel.create(req.body);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(notification, 'Notification created successfully'));
});
exports.updateNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const notification = await Notification_1.NotificationModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate('recipient');
    if (!notification) {
        throw new httpError_1.HttpError(404, 'Notification not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(notification, 'Notification updated successfully'));
});
exports.deleteNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const notification = await Notification_1.NotificationModel.findByIdAndDelete(req.params.id);
    if (!notification) {
        throw new httpError_1.HttpError(404, 'Notification not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(notification, 'Notification deleted successfully'));
});
