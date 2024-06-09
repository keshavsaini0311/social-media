import express from 'express';
import { login, signup, signout} from'../controllers/Auth.js';
const router =express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/signout',signout);

export default router;