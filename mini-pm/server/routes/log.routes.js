import { Router } from 'express';
import { list }   from '../controllers/log.controller.js';

const router = Router();
router.get('/', list);
export default router;