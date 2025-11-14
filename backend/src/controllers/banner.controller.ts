import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BannerModel } from '../models/Banner';
import { createSuccessResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';

export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const filters: Record<string, unknown> = {};
  if (typeof req.query.role === 'string') {
    filters.roles = req.query.role;
  }
  const banners = await BannerModel.find(filters);
  res.json(createSuccessResponse(banners));
});

export const getBannerById = asyncHandler(async (req: Request, res: Response) => {
  const banner = await BannerModel.findById(req.params.id);
  if (!banner) {
    throw new HttpError(404, 'Banner not found');
  }
  res.json(createSuccessResponse(banner));
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const banner = await BannerModel.create(req.body);
  res.status(201).json(createSuccessResponse(banner, 'Banner created successfully'));
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(400, 'Validation failed', errors.array());
  }
  const banner = await BannerModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner) {
    throw new HttpError(404, 'Banner not found');
  }
  res.json(createSuccessResponse(banner, 'Banner updated successfully'));
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await BannerModel.findByIdAndDelete(req.params.id);
  if (!banner) {
    throw new HttpError(404, 'Banner not found');
  }
  res.json(createSuccessResponse(banner, 'Banner deleted successfully'));
});

