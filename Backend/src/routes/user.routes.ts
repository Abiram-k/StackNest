import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();


//OAuth
router.post('/auth/google/callback', AuthController.googleAuth);


export default router;