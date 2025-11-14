"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentProgress = exports.updateStudentProgress = exports.createStudentProgress = exports.getStudentProgressById = exports.getStudentProgressList = void 0;
const express_validator_1 = require("express-validator");
const StudentProgress_1 = require("../models/StudentProgress");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getStudentProgressList = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.studentId === 'string') {
        filters.student = req.query.studentId;
    }
    if (typeof req.query.courseId === 'string') {
        filters.course = req.query.courseId;
    }
    const progress = await StudentProgress_1.StudentProgressModel.find(filters).populate('student').populate('course');
    res.json((0, apiResponse_1.createSuccessResponse)(progress));
});
exports.getStudentProgressById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const progress = await StudentProgress_1.StudentProgressModel.findById(req.params.id).populate('student').populate('course');
    if (!progress) {
        throw new httpError_1.HttpError(404, 'Student progress record not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(progress));
});
exports.createStudentProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const progress = await StudentProgress_1.StudentProgressModel.create(req.body);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(progress, 'Student progress created successfully'));
});
exports.updateStudentProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const progress = await StudentProgress_1.StudentProgressModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate('student')
        .populate('course');
    if (!progress) {
        throw new httpError_1.HttpError(404, 'Student progress record not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(progress, 'Student progress updated successfully'));
});
exports.deleteStudentProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const progress = await StudentProgress_1.StudentProgressModel.findByIdAndDelete(req.params.id);
    if (!progress) {
        throw new httpError_1.HttpError(404, 'Student progress record not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(progress, 'Student progress deleted successfully'));
});
