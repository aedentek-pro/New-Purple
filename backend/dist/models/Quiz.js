"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModel = void 0;
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    options: { type: [String], required: true, validate: (v) => v.length >= 2 },
    correctAnswerIndex: { type: Number, required: true, min: 0 },
}, { _id: false });
const quizSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    questions: { type: [questionSchema], default: [] },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course' },
}, { timestamps: true });
exports.QuizModel = (0, mongoose_1.model)('Quiz', quizSchema);
