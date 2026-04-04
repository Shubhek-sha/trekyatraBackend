// routes/trek.routes.js

import {Router} from 'express';
import {createTrek, getAllTreks, getTrekById, updateTrek, deleteTrek, updateItinerary} from '../controllers/trek.controller.js'; // <-- .js extension required for ESM

const router = Router();

router.get('/', getAllTreks); // GET    /api/treks
router.post('/', createTrek); // POST   /api/treks
router.get('/:id', getTrekById); // GET    /api/treks/:id
router.patch('/:id', updateTrek); // PATCH  /api/treks/:id
router.delete('/:id', deleteTrek); // DELETE /api/treks/:id
router.patch('/:id/itinerary', updateItinerary); // PATCH  /api/treks/:id/itinerary

export default router;
