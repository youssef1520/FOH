import { Router }        from 'express';
import { login, demoLogin } from '../controllers/auth.controller.js';

const router = Router();
router.post('/login',      login);
router.post('/demo-login', demoLogin);
export default router;