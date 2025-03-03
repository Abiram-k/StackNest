import express from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

const router = express.Router();

const userRespository = new UserRepository()
const authService = new AuthService(userRespository)
const authController = new AuthController(authService);

//login
router.post('/login', authController.login.bind(authController));
router.get("/refresh-token", authController.generateAccessToken.bind(authController));

//OAuth  
router.post('/google/callback', authController.googleAuth.bind(authController));

//registration
router.post("/initiate-registration",authController.initiateRegistration.bind(authController));
router.post('/register',authController.register.bind(authController));

//forgotPassword
router.post("/forgot-password",authController.forgotPassword.bind(authController));
router.post("/reset-password",authController.resetPassword.bind(authController));


export default router;