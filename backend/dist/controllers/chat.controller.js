"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatMessage = exports.updateChatMessage = exports.createChatMessage = exports.getChatMessageById = exports.getChatMessages = void 0;
const express_validator_1 = require("express-validator");
const ChatMessage_1 = require("../models/ChatMessage");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getChatMessages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.userId === 'string') {
        filters.user = req.query.userId;
    }
    const messages = await ChatMessage_1.ChatMessageModel.find(filters)
        .populate('user')
        .sort({ createdAt: -1 });
    res.json((0, apiResponse_1.createSuccessResponse)(messages));
});
exports.getChatMessageById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const message = await ChatMessage_1.ChatMessageModel.findById(req.params.id).populate('user');
    if (!message) {
        throw new httpError_1.HttpError(404, 'Chat message not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(message));
});
exports.createChatMessage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const timestamp = req.body.timestamp && typeof req.body.timestamp === 'string'
        ? new Date(req.body.timestamp)
        : req.body.timestamp instanceof Date
            ? req.body.timestamp
            : new Date();
    const message = await ChatMessage_1.ChatMessageModel.create({ ...req.body, timestamp });
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(message, 'Chat message created successfully'));
});
exports.updateChatMessage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const message = await ChatMessage_1.ChatMessageModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate('user');
    if (!message) {
        throw new httpError_1.HttpError(404, 'Chat message not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(message, 'Chat message updated successfully'));
});
exports.deleteChatMessage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const message = await ChatMessage_1.ChatMessageModel.findByIdAndDelete(req.params.id);
    if (!message) {
        throw new httpError_1.HttpError(404, 'Chat message not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(message, 'Chat message deleted successfully'));
});
