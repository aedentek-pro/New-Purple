"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode ?? 500;
    const payload = (0, apiResponse_1.createErrorResponse)(err.message || 'Internal Server Error');
    if (err.errors) {
        payload.message = `${payload.message}. ${err.errors.map((e) => e.msg).join(', ')}`;
    }
    res.status(statusCode).json(payload);
};
exports.errorHandler = errorHandler;
