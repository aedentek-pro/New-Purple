"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["Student"] = "Student";
    UserRole["Instructor"] = "Instructor";
    UserRole["Admin"] = "Admin";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
}, { timestamps: true });
userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        const { _id, __v, passwordHash, ...rest } = ret;
        return {
            ...rest,
            id: _id.toString(),
        };
    },
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
