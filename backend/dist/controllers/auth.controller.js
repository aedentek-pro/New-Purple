"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.checkEmailAvailability = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
const jwt_1 = require("../utils/jwt");
const normalizeEmail = (email) => email.trim().toLowerCase();
const sanitizeUser = (user) => {
    const { passwordHash, ...rest } = user.toJSON();
    return rest;
};
exports.checkEmailAvailability = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const email = normalizeEmail(req.query.email ?? '');
    if (!email) {
        throw new httpError_1.HttpError(400, 'Email query parameter is required');
    }
    const existingUser = await User_1.UserModel.findOne({ email });
    res.json((0, apiResponse_1.createSuccessResponse)({
        exists: Boolean(existingUser),
    }));
});
exports.signup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const { name, email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User_1.UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new httpError_1.HttpError(409, 'An account with this email already exists.');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.UserModel.create({
        name,
        email: normalizedEmail,
        role,
        passwordHash,
    });
    const token = (0, jwt_1.generateToken)({ sub: user.id, role: user.role });
    res.status(201).json((0, apiResponse_1.createSuccessResponse)({
        user: sanitizeUser(user),
        token,
    }, 'Account created successfully'));
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User_1.UserModel.findOne({ email: normalizedEmail });
    if (!user) {
        throw new httpError_1.HttpError(401, 'Invalid email or password');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new httpError_1.HttpError(401, 'Invalid email or password');
    }
    const token = (0, jwt_1.generateToken)({ sub: user.id, role: user.role });
    res.json((0, apiResponse_1.createSuccessResponse)({
        user: sanitizeUser(user),
        token,
    }, 'Login successful'));
});
