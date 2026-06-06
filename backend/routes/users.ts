import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/authController';

const router = Router();

router.get('/:userId', getUserProfile);
router.put('/:userId', updateUserProfile);

export default router;
