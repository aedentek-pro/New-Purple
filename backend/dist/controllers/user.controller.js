"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getUsers = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const users = await User_1.UserModel.find();
    res.json((0, apiResponse_1.createSuccessResponse)(users));
});
exports.getUserById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.UserModel.findById(req.params.id);
    if (!user) {
        throw new httpError_1.HttpError(404, 'User not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(user));
});
exports.createUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    // Normalize email to lowercase
    const normalizedEmail = req.body.email.toLowerCase().trim();
    // Check if user with this email already exists
    const existingUser = await User_1.UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new httpError_1.HttpError(409, 'An account with this email already exists.');
    }
    const { password, ...rest } = req.body;
    if (!password) {
        throw new httpError_1.HttpError(400, 'Password is required');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.UserModel.create({
        ...rest,
        email: normalizedEmail,
        passwordHash,
    });
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(user, 'User created successfully'));
});
exports.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const updateData = { ...req.body };
    if (updateData.email && typeof updateData.email === 'string') {
        updateData.email = updateData.email.toLowerCase().trim();
    }
    if (updateData.password && typeof updateData.password === 'string') {
        updateData.passwordHash = await bcryptjs_1.default.hash(updateData.password, 10);
        delete updateData.password;
    }
    const user = await User_1.UserModel.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new httpError_1.HttpError(404, 'User not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(user, 'User updated successfully'));
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new httpError_1.HttpError(404, 'User not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(user, 'User deleted successfully'));
});
