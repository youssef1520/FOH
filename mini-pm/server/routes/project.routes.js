import { Router } from 'express';
import {
  create,
  findAll,
  findOne,
  update,
  remove
} from '../controllers/project.controller.js';
import authorize from '../middleware/authorize.js';

const router = Router();
router.get('/',       findAll);
router.post('/',      authorize('admin'), create);
router.get('/:id',    findOne);
router.put('/:id',    authorize('admin'), update);
router.delete('/:id', authorize('admin'), remove);
export default router;