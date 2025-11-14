"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionModel = void 0;
const mongoose_1 = require("mongoose");
const sessionFeedbackSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
}, { _id: false });
const liveSessionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number },
    attendees: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'User', default: [] },
    recordingUrl: { type: String },
    reminderSent: { type: Boolean, default: false },
    feedback: { type: [sessionFeedbackSchema], default: [] },
    quiz: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz' },
}, { timestamps: true });
exports.LiveSessionModel = (0, mongoose_1.model)('LiveSession', liveSessionSchema);
