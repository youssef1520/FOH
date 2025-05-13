// server/routes/task.routes.js
import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import authorize   from '../middleware/authorize.js';
import {
  create,
  list,
  update,
  remove
} from '../controllers/task.controller.js';

const router = Router();

// every /api/tasks route requires a valid JWT
router.use(authenticate);

// GET   /api/tasks
router.get('/', list);

// POST  /api/tasks
router.post('/', authorize('admin'), create);

// PUT   /api/tasks/:id
router.put('/:id', update);

// DELETE /api/tasks/:id
router.delete('/:id', authorize('admin'), remove);

export default router;