"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.updateAssignment = exports.createAssignment = exports.getAssignmentById = exports.getAssignments = void 0;
const express_validator_1 = require("express-validator");
const Assignment_1 = require("../models/Assignment");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getAssignments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.courseId === 'string') {
        filters.course = req.query.courseId;
    }
    const assignments = await Assignment_1.AssignmentModel.find(filters).populate('course');
    res.json((0, apiResponse_1.createSuccessResponse)(assignments));
});
exports.getAssignmentById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const assignment = await Assignment_1.AssignmentModel.findById(req.params.id).populate('course');
    if (!assignment) {
        throw new httpError_1.HttpError(404, 'Assignment not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(assignment));
});
exports.createAssignment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const assignment = await Assignment_1.AssignmentModel.create(req.body);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(assignment, 'Assignment created successfully'));
});
exports.updateAssignment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const assignment = await Assignment_1.AssignmentModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate('course');
    if (!assignment) {
        throw new httpError_1.HttpError(404, 'Assignment not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(assignment, 'Assignment updated successfully'));
});
exports.deleteAssignment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const assignment = await Assignment_1.AssignmentModel.findByIdAndDelete(req.params.id);
    if (!assignment) {
        throw new httpError_1.HttpError(404, 'Assignment not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(assignment, 'Assignment deleted successfully'));
});
