"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuiz = exports.updateQuiz = exports.createQuiz = exports.getQuizById = exports.getQuizzes = void 0;
const express_validator_1 = require("express-validator");
const Quiz_1 = require("../models/Quiz");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getQuizzes = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const quizzes = await Quiz_1.QuizModel.find().populate('course');
    res.json((0, apiResponse_1.createSuccessResponse)(quizzes));
});
exports.getQuizById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const quiz = await Quiz_1.QuizModel.findById(req.params.id).populate('course');
    if (!quiz) {
        throw new httpError_1.HttpError(404, 'Quiz not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(quiz));
});
exports.createQuiz = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const quiz = await Quiz_1.QuizModel.create(req.body);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(quiz, 'Quiz created successfully'));
});
exports.updateQuiz = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const quiz = await Quiz_1.QuizModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!quiz) {
        throw new httpError_1.HttpError(404, 'Quiz not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(quiz, 'Quiz updated successfully'));
});
exports.deleteQuiz = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const quiz = await Quiz_1.QuizModel.findByIdAndDelete(req.params.id);
    if (!quiz) {
        throw new httpError_1.HttpError(404, 'Quiz not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(quiz, 'Quiz deleted successfully'));
});
