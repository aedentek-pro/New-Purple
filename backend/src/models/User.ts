import { Schema, model, Types } from 'mongoose';

export enum UserRole {
  Student = 'Student',
  Instructor = 'Instructor',
  Admin = 'Admin',
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  phoneNumber?: string;
  address?: string;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const retObj = ret as Record<string, unknown> & { _id: Types.ObjectId };
    const id = retObj._id.toString();
    Reflect.deleteProperty(retObj, '_id');
    Reflect.deleteProperty(retObj, '__v');
    Reflect.deleteProperty(retObj, 'passwordHash');
    return {
      ...retObj,
      id,
    };
  },
});

export const UserModel = model<User>('User', userSchema);

