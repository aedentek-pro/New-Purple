"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const notFoundHandler = (req, res) => {
    res.status(404).json((0, apiResponse_1.createErrorResponse)(`Route ${req.originalUrl} not found`));
};
exports.notFoundHandler = notFoundHandler;
