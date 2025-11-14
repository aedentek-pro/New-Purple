import { Schema, model } from 'mongoose';
import { UserRole } from './User';

export interface Banner {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  background: string;
  roles?: UserRole[];
  personalizationKey?: string;
}

const bannerSchema = new Schema<Banner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    ctaText: { type: String, required: true },
    ctaLink: { type: String, required: true },
    background: { type: String, required: true },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: undefined,
    },
    personalizationKey: { type: String },
  },
  { timestamps: true },
);

export const BannerModel = model<Banner>('Banner', bannerSchema);

