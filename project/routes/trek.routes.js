// routes/trek.routes.js

import {Router} from 'express';
import {createTrek, getAllTreks, getTrekById, updateTrek, deleteTrek, updateItinerary, getTrendingTreks, getSimilarTreks} from '../controllers/trek.controller.js';

const router = Router();

router.get('/', getAllTreks);
router.get('/trending', getTrendingTreks);
router.get('/similar', getSimilarTreks);
router.post('/', createTrek);
router.get('/:id', getTrekById);
router.patch('/:id', updateTrek);
router.delete('/:id', deleteTrek);
router.patch('/:id/itinerary', updateItinerary);

export default router;
