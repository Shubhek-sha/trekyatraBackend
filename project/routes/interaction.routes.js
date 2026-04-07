// project/routes/interaction.routes.js
import { Router } from 'express';
import { 
  createInteraction, 
  getAllInteractions, 
  getInteractionById, 
  updateInteraction, 
  deleteInteraction 
} from '../controllers/interaction.controller.js';

const router = Router();

router.post('/', createInteraction);
router.get('/', getAllInteractions);
router.get('/:id', getInteractionById);
router.patch('/:id', updateInteraction);
router.delete('/:id', deleteInteraction);

export default router;
