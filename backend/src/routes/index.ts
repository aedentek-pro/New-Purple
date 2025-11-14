import { Router } from 'express';
import assignmentRoutes from './assignment.routes';
import authRoutes from './auth.routes';
import bannerRoutes from './banner.routes';
import chatRoutes from './chat.routes';
import courseRoutes from './course.routes';
import liveSessionRoutes from './liveSession.routes';
import liveSessionProgressRoutes from './liveSessionProgress.routes';
import notificationRoutes from './notification.routes';
import oneToOneRoutes from './oneToOneSession.routes';
import quizRoutes from './quiz.routes';
import studentProgressRoutes from './studentProgress.routes';
import userRoutes from './user.routes';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/quizzes', quizRoutes);
router.use('/student-progress', studentProgressRoutes);
router.use('/notifications', notificationRoutes);
router.use('/chat-messages', chatRoutes);
router.use('/live-sessions', liveSessionRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/one-to-one-sessions', oneToOneRoutes);
router.use('/live-session-progress', liveSessionProgressRoutes);
router.use('/banners', bannerRoutes);

