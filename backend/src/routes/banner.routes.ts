import { Router } from 'express';
import { body, param } from 'express-validator';
import { createBanner, deleteBanner, getBannerById, getBanners, updateBanner } from '../controllers/banner.controller';
import { UserRole } from '../models/User';

const router = Router();

const bannerValidators = [
  body('title').isString().withMessage('Title is required'),
  body('subtitle').isString().withMessage('Subtitle is required'),
  body('ctaText').isString().withMessage('CTA text is required'),
  body('ctaLink').isString().withMessage('CTA link is required'),
  body('background').isString().withMessage('Background is required'),
  body('roles')
    .optional()
    .isArray()
    .withMessage('Roles must be an array')
    .custom((roles: string[]) =>
      roles.every((role) => Object.values(UserRole).includes(role as UserRole)),
    )
    .withMessage(`Roles must be in: ${Object.values(UserRole).join(', ')}`),
  body('personalizationKey').optional().isString(),
];

router.get('/', getBanners);
router.get('/:id', [param('id').isMongoId()], getBannerById);
router.post('/', bannerValidators, createBanner);
router.put('/:id', [param('id').isMongoId(), ...bannerValidators], updateBanner);
router.delete('/:id', [param('id').isMongoId()], deleteBanner);

export default router;

