// routes/trek.routes.js

import {Router} from 'express';
import {createTrek, getAllTreks, getTrekById, updateTrek, deleteTrek, updateItinerary} from '../controllers/trek.controller.js';

const router = Router();

router.get('/', getAllTreks);
router.post('/', createTrek);
router.get('/:id', getTrekById);
router.patch('/:id', updateTrek);
router.delete('/:id', deleteTrek);
router.patch('/:id/itinerary', updateItinerary);

export default router;
