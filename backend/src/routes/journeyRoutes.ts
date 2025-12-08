import { Router } from 'express';
import {
  getJourneyResources,
  getJourneyResourcesByCategory,
  getJourneyResource,
  createJourneyResource,
  updateJourneyResource,
  deleteJourneyResource
} from '../controllers/journeyController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getJourneyResources);
router.get('/grouped', getJourneyResourcesByCategory);
router.get('/:id', getJourneyResource);

// Admin-only routes (protected)
router.post('/', protect, adminOnly, createJourneyResource);
router.put('/:id', protect, adminOnly, updateJourneyResource);
router.delete('/:id', protect, adminOnly, deleteJourneyResource);

export default router;
