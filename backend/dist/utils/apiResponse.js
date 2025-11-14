"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createSuccessResponse = void 0;
const createSuccessResponse = (data, message) => ({
    success: true,
    data,
    message,
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (message) => ({
    success: false,
    message,
});
exports.createErrorResponse = createErrorResponse;
