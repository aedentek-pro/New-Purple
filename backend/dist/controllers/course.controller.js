"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getCourses = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const Course_1 = require("../models/Course");
const Quiz_1 = require("../models/Quiz");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getCourses = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.instructorId === 'string') {
        filters.instructor = req.query.instructorId;
    }
    if (typeof req.query.category === 'string') {
        filters.category = req.query.category;
    }
    if (typeof req.query.difficulty === 'string') {
        filters.difficulty = req.query.difficulty;
    }
    const courses = await Course_1.CourseModel.find(filters)
        .populate('instructor')
        .populate('quiz');
    res.json((0, apiResponse_1.createSuccessResponse)(courses));
});
exports.getCourseById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const course = await Course_1.CourseModel.findById(req.params.id).populate('instructor').populate('quiz');
    if (!course) {
        throw new httpError_1.HttpError(404, 'Course not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(course));
});
exports.createCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const { quizId, quiz, ...coursePayload } = req.body;
    let quizObjectId = quizId;
    if (quiz && !quizId) {
        const createdQuiz = await Quiz_1.QuizModel.create(quiz);
        quizObjectId = createdQuiz._id;
    }
    else if (quizId) {
        const existingQuiz = await Quiz_1.QuizModel.findById(quizId);
        if (!existingQuiz) {
            throw new httpError_1.HttpError(404, 'Linked quiz not found');
        }
    }
    const course = await Course_1.CourseModel.create({
        ...coursePayload,
        quiz: quizObjectId,
    });
    if (quizObjectId) {
        await Quiz_1.QuizModel.findByIdAndUpdate(quizObjectId, { course: course._id });
    }
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(course, 'Course created successfully'));
});
exports.updateCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const { quizId, quiz, ...coursePayload } = req.body;
    let quizObjectId = quizId;
    if (quiz) {
        if (quizId) {
            const updatedQuiz = await Quiz_1.QuizModel.findByIdAndUpdate(quizId, quiz, { new: true, runValidators: true });
            if (!updatedQuiz) {
                throw new httpError_1.HttpError(404, 'Linked quiz not found');
            }
        }
        else {
            const createdQuiz = await Quiz_1.QuizModel.create(quiz);
            quizObjectId = createdQuiz._id;
        }
    }
    const course = await Course_1.CourseModel.findByIdAndUpdate(req.params.id, { ...coursePayload, quiz: quizObjectId }, { new: true, runValidators: true })
        .populate('instructor')
        .populate('quiz');
    if (!course) {
        throw new httpError_1.HttpError(404, 'Course not found');
    }
    if (course.quiz) {
        const quizId = (() => {
            if (typeof course.quiz === 'string') {
                return course.quiz;
            }
            if (course.quiz instanceof mongoose_1.Types.ObjectId) {
                return course.quiz.toString();
            }
            if (typeof course.quiz._id !== 'undefined') {
                const value = course.quiz._id;
                return value instanceof mongoose_1.Types.ObjectId ? value.toString() : value;
            }
            return undefined;
        })();
        if (quizId) {
            await Quiz_1.QuizModel.findByIdAndUpdate(quizId, { course: course._id });
        }
    }
    res.json((0, apiResponse_1.createSuccessResponse)(course, 'Course updated successfully'));
});
exports.deleteCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const course = await Course_1.CourseModel.findByIdAndDelete(req.params.id);
    if (!course) {
        throw new httpError_1.HttpError(404, 'Course not found');
    }
    if (course.quiz) {
        await Quiz_1.QuizModel.findByIdAndUpdate(course.quiz, { course: null });
    }
    res.json((0, apiResponse_1.createSuccessResponse)(course, 'Course deleted successfully'));
});
