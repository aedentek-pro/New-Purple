"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const banner_controller_1 = require("../controllers/banner.controller");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
const bannerValidators = [
    (0, express_validator_1.body)('title').isString().withMessage('Title is required'),
    (0, express_validator_1.body)('subtitle').isString().withMessage('Subtitle is required'),
    (0, express_validator_1.body)('ctaText').isString().withMessage('CTA text is required'),
    (0, express_validator_1.body)('ctaLink').isString().withMessage('CTA link is required'),
    (0, express_validator_1.body)('background').isString().withMessage('Background is required'),
    (0, express_validator_1.body)('roles')
        .optional()
        .isArray()
        .withMessage('Roles must be an array')
        .custom((roles) => roles.every((role) => Object.values(User_1.UserRole).includes(role)))
        .withMessage(`Roles must be in: ${Object.values(User_1.UserRole).join(', ')}`),
    (0, express_validator_1.body)('personalizationKey').optional().isString(),
];
router.get('/', banner_controller_1.getBanners);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId()], banner_controller_1.getBannerById);
router.post('/', bannerValidators, banner_controller_1.createBanner);
router.put('/:id', [(0, express_validator_1.param)('id').isMongoId(), ...bannerValidators], banner_controller_1.updateBanner);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId()], banner_controller_1.deleteBanner);
exports.default = router;
