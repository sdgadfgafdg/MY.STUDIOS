import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';

const router = Router();

router.get('/sessions/availability', SessionController.getStudioAvailability);
router.get('/studios/:studioId/upcoming-sessions', SessionController.getUpcomingStudioSessions);
router.get('/equipment/busy', SessionController.getBusyEquipment);
router.post('/sessions/calculate', SessionController.calculateBookingPrice);
router.post('/sessions/create', SessionController.createBooking);

export default router;