import express from 'express';
import { authController } from '../config/di';

const router = express.Router();

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

// cloudinary-uploads

router.get("/cloudinary/sign",authController.uploadToSignedCloudinary.bind(authController));

export default router;