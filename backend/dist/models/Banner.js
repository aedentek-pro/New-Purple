"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerModel = void 0;
const mongoose_1 = require("mongoose");
const User_1 = require("./User");
const bannerSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    ctaText: { type: String, required: true },
    ctaLink: { type: String, required: true },
    background: { type: String, required: true },
    roles: {
        type: [String],
        enum: Object.values(User_1.UserRole),
        default: undefined,
    },
    personalizationKey: { type: String },
}, { timestamps: true });
exports.BannerModel = (0, mongoose_1.model)('Banner', bannerSchema);
