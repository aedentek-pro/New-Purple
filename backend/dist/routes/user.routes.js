"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
const createOrUpdateUserValidators = [
    (0, express_validator_1.body)('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('role')
        .isIn(Object.values(User_1.UserRole))
        .withMessage(`Role must be one of: ${Object.values(User_1.UserRole).join(', ')}`),
    (0, express_validator_1.body)('password')
        .if((_value, { req }) => req.method === 'POST')
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('password')
        .if((_value, { req }) => req.method === 'PUT')
        .optional()
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('phoneNumber').optional().isString(),
    (0, express_validator_1.body)('address').optional().isString(),
];
router.get('/', user_controller_1.getUsers);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], user_controller_1.getUserById);
router.post('/', createOrUpdateUserValidators, user_controller_1.createUser);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...createOrUpdateUserValidators], user_controller_1.updateUser);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], user_controller_1.deleteUser);
exports.default = router;
