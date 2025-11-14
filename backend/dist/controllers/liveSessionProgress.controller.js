"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLiveSessionProgress = exports.updateLiveSessionProgress = exports.createLiveSessionProgress = exports.getLiveSessionProgressById = exports.getLiveSessionProgressList = void 0;
const express_validator_1 = require("express-validator");
const LiveSessionProgress_1 = require("../models/LiveSessionProgress");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getLiveSessionProgressList = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.sessionId === 'string') {
        filters.session = req.query.sessionId;
    }
    if (typeof req.query.studentId === 'string') {
        filters.student = req.query.studentId;
    }
    const progress = await LiveSessionProgress_1.LiveSessionProgressModel.find(filters).populate('session').populate('student');
    res.json((0, apiResponse_1.createSuccessResponse)(progress));
});
exports.getLiveSessionProgressById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const progress = await LiveSessionProgress_1.LiveSessionProgressModel.findById(req.params.id)
        .populate('session')
        .populate('student');
    if (!progress) {
        throw new httpError_1.HttpError(404, 'Live session progress record not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(progress));
});
exports.createLiveSessionProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const progress = await LiveSessionProgress_1.LiveSessionProgressModel.create(req.body);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(progress, 'Live session progress created successfully'));
});
exports.updateLiveSessionProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const progress = await LiveSessionProgress_1.LiveSessionProgressModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate('session')
        .populate('student');
    if (!progress) {
        throw new httpError_1.HttpError(404, 'Live session progress record not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(progress, 'Live session progress updated successfully'));
});
exports.deleteLiveSessionProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const progress = await LiveSessionProgress_1.LiveSessionProgressModel.findByIdAndDelete(req.params.id);
    if (!progress) {
        throw new httpError_1.HttpError(404, 'Live session progress record not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(progress, 'Live session progress deleted successfully'));
});
