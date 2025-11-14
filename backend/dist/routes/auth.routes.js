"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.get('/check-email', [(0, express_validator_1.query)('email').isEmail().withMessage('Valid email is required')], auth_controller_1.checkEmailAvailability);
router.post('/signup', [
    (0, express_validator_1.body)('name').isString().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .isIn(Object.values(User_1.UserRole))
        .withMessage(`Role must be one of: ${Object.values(User_1.UserRole).join(', ')}`),
], auth_controller_1.signup);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isString().notEmpty().withMessage('Password is required'),
], auth_controller_1.login);
exports.default = router;
