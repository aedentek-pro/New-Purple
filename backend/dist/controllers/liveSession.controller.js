"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLiveSession = exports.updateLiveSession = exports.createLiveSession = exports.getLiveSessionById = exports.getLiveSessions = void 0;
const express_validator_1 = require("express-validator");
const LiveSession_1 = require("../models/LiveSession");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
const parseDateValue = (value) => {
    if (!value) {
        return undefined;
    }
    if (value instanceof Date) {
        return value;
    }
    const parsed = new Date(value);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Number.isNaN(parsed.getTime())) {
        throw new httpError_1.HttpError(400, `Invalid date value provided: ${value}`);
    }
    return parsed;
};
exports.getLiveSessions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.instructorId === 'string') {
        filters.instructor = req.query.instructorId;
    }
    if (typeof req.query.upcoming === 'string' && req.query.upcoming === 'true') {
        filters.dateTime = { $gte: new Date() };
    }
    const sessions = await LiveSession_1.LiveSessionModel.find(filters)
        .populate('instructor')
        .populate('attendees')
        .populate('quiz');
    res.json((0, apiResponse_1.createSuccessResponse)(sessions));
});
exports.getLiveSessionById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const session = await LiveSession_1.LiveSessionModel.findById(req.params.id)
        .populate('instructor')
        .populate('attendees')
        .populate('quiz');
    if (!session) {
        throw new httpError_1.HttpError(404, 'Live session not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(session));
});
exports.createLiveSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const payload = {
        ...req.body,
        dateTime: parseDateValue(req.body.dateTime),
        endTime: parseDateValue(req.body.endTime),
    };
    const session = await LiveSession_1.LiveSessionModel.create(payload);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(session, 'Live session created successfully'));
});
exports.updateLiveSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const payload = { ...req.body };
    if (req.body.dateTime) {
        payload.dateTime = parseDateValue(req.body.dateTime);
    }
    if (req.body.endTime) {
        payload.endTime = parseDateValue(req.body.endTime);
    }
    const session = await LiveSession_1.LiveSessionModel.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
    })
        .populate('instructor')
        .populate('attendees')
        .populate('quiz');
    if (!session) {
        throw new httpError_1.HttpError(404, 'Live session not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(session, 'Live session updated successfully'));
});
exports.deleteLiveSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const session = await LiveSession_1.LiveSessionModel.findByIdAndDelete(req.params.id);
    if (!session) {
        throw new httpError_1.HttpError(404, 'Live session not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(session, 'Live session deleted successfully'));
});
