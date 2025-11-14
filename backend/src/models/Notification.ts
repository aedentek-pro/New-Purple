import { Schema, Types, model } from 'mongoose';

export type NotificationType = 'system' | 'course' | 'certificate' | 'session' | 'announcement';

export interface Notification {
  recipient: Types.ObjectId;
  message: string;
  read: boolean;
  type: NotificationType;
  link?: string;
}

const notificationSchema = new Schema<Notification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['system', 'course', 'certificate', 'session', 'announcement'],
      required: true,
    },
    link: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const NotificationModel = model<Notification>('Notification', notificationSchema);

