"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProgressModel = void 0;
const mongoose_1 = require("mongoose");
const studentProgressSchema = new mongoose_1.Schema({
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    completedModules: { type: [mongoose_1.Schema.Types.ObjectId], default: [] },
    quizScore: { type: Number, default: null },
    assignmentStatus: {
        type: String,
        enum: ['pending', 'submitted', 'graded'],
        default: 'pending',
    },
    rating: { type: Number },
    completionNotified: { type: Boolean, default: false },
    certificateIssued: { type: Boolean, default: false },
}, { timestamps: true });
studentProgressSchema.index({ course: 1, student: 1 }, { unique: true });
exports.StudentProgressModel = (0, mongoose_1.model)('StudentProgress', studentProgressSchema);
