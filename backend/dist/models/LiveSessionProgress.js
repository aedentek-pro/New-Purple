"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionProgressModel = void 0;
const mongoose_1 = require("mongoose");
const liveSessionProgressSchema = new mongoose_1.Schema({
    session: { type: mongoose_1.Schema.Types.ObjectId, ref: 'LiveSession', required: true },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    quizScore: { type: Number, default: null },
}, { timestamps: true });
liveSessionProgressSchema.index({ session: 1, student: 1 }, { unique: true });
exports.LiveSessionProgressModel = (0, mongoose_1.model)('LiveSessionProgress', liveSessionProgressSchema);
