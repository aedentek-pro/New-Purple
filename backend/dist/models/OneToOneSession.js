"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneToOneSessionModel = void 0;
const mongoose_1 = require("mongoose");
const oneToOneSessionSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'completed', 'canceled', 'rejected'],
        default: 'pending',
    },
    requestedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reminderSent: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
}, { timestamps: true });
exports.OneToOneSessionModel = (0, mongoose_1.model)('OneToOneSession', oneToOneSessionSchema);
