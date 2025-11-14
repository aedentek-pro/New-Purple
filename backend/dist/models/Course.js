"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModel = void 0;
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'video'], required: true },
    content: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
}, { _id: true });
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnailUrl: { type: String, required: true },
    modules: { type: [moduleSchema], default: [] },
    quiz: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz' },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    price: { type: Number },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
}, { timestamps: true });
exports.CourseModel = (0, mongoose_1.model)('Course', courseSchema);
