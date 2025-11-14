"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBannerById = exports.getBanners = void 0;
const express_validator_1 = require("express-validator");
const Banner_1 = require("../models/Banner");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
exports.getBanners = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = {};
    if (typeof req.query.role === 'string') {
        filters.roles = req.query.role;
    }
    const banners = await Banner_1.BannerModel.find(filters);
    res.json((0, apiResponse_1.createSuccessResponse)(banners));
});
exports.getBannerById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const banner = await Banner_1.BannerModel.findById(req.params.id);
    if (!banner) {
        throw new httpError_1.HttpError(404, 'Banner not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(banner));
});
exports.createBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const banner = await Banner_1.BannerModel.create(req.body);
    res.status(201).json((0, apiResponse_1.createSuccessResponse)(banner, 'Banner created successfully'));
});
exports.updateBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new httpError_1.HttpError(400, 'Validation failed', errors.array());
    }
    const banner = await Banner_1.BannerModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!banner) {
        throw new httpError_1.HttpError(404, 'Banner not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(banner, 'Banner updated successfully'));
});
exports.deleteBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const banner = await Banner_1.BannerModel.findByIdAndDelete(req.params.id);
    if (!banner) {
        throw new httpError_1.HttpError(404, 'Banner not found');
    }
    res.json((0, apiResponse_1.createSuccessResponse)(banner, 'Banner deleted successfully'));
});
