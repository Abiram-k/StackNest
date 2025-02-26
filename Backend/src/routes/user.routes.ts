import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', AuthController.login);
router.post("/initiate-regestration",AuthController.initiateRegistration)
router.post('/register',AuthController.register)
router.post('/auth/google/callback', AuthController.googleAuth);

export default router;