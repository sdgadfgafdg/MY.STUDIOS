import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';

const router = Router();

router.get('/sessions/availability', SessionController.getStudioAvailability);
router.post('/sessions/calculate', SessionController.calculateBookingPrice);
router.post('/sessions/create', SessionController.createBooking);

router.get('/studios/:studioId/upcoming-sessions', SessionController.getUpcomingStudioSessions);

router.get('/equipment/busy', SessionController.getBusyEquipment);

router.post('/sessions/verify-access', SessionController.verifyAccess);
router.post('/sessions/check-status', SessionController.checkAndUpdateSessionStatus);

router.get('/admin/studio-analytics', SessionController.getStudioWeeklyAnalytics);
router.get('/admin/total-analytics', SessionController.getTotalWeeklyAnalytics);

export default router;