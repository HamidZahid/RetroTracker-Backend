import { Router } from 'express';
import { cardController } from '../controllers/card.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  requireRetroAccess,
  requireCardOwnership,
} from '../middleware/authorization.middleware';

const router = Router();

router.use(authenticate);

router.post('/retros/:retroId/cards', requireRetroAccess, cardController.createCard);
router.get('/retros/:retroId/cards', requireRetroAccess, cardController.getRetroCards);
router.put('/cards/:cardId', requireCardOwnership, cardController.updateCard);
router.delete('/cards/:cardId', requireCardOwnership, cardController.deleteCard);

export default router;

