"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentModel = void 0;
const mongoose_1 = require("mongoose");
const assignmentSchema = new mongoose_1.Schema({
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
}, { timestamps: true });
exports.AssignmentModel = (0, mongoose_1.model)('Assignment', assignmentSchema);
