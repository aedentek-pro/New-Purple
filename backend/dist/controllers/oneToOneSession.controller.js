"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneToOneSession = exports.updateOneToOneSession = exports.createOneToOneSession = exports.getOneToOneSessionById = exports.getOneToOneSessions = void 0;
const express_validator_1 = require("express-validator");
const OneToOneSession_1 = require("../models/OneToOneSession");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getOneToOneSessions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.studentId === 'string') {
        filters.student = req.query.studentId;
    }
    if (typeof req.query.instructorId === 'string') {
        filters.instructor = req.query.instructorId;
    }
    if (typeof req.query.status === 'string') {
        filters.status = req.query.status;
    }
    const sessions = await OneToOneSession_1.OneToOneSessionModel.find(filters)
        .populate('student')
        .populate('instructor')
        .populate('requestedBy');
    res.json((0, apiResponse_1.createSuccessResponse)(sessions));
});
exports.getOneToOneSessionById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const session = await OneToOneSession_1.OneToOneSessionModel.findById(req.params.id)
        .populate('student')
        .populate('instructor')
        .populate('requestedBy');
    if (!session) {
        throw new httpError_1.HttpError(404, 'One-to-one session not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(session));
});
exports.createOneToOneSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const session = await OneToOneSession_1.OneToOneSessionModel.create(req.body);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(session, 'One-to-one session created successfully'));
});
exports.updateOneToOneSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const session = await OneToOneSession_1.OneToOneSessionModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate('student')
        .populate('instructor')
        .populate('requestedBy');
    if (!session) {
        throw new httpError_1.HttpError(404, 'One-to-one session not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(session, 'One-to-one session updated successfully'));
});
exports.deleteOneToOneSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const session = await OneToOneSession_1.OneToOneSessionModel.findByIdAndDelete(req.params.id);
    if (!session) {
        throw new httpError_1.HttpError(404, 'One-to-one session not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(session, 'One-to-one session deleted successfully'));
});
