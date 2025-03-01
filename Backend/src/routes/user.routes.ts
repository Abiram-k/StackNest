import express from 'express';
import authController from '../controllers/user/user.controller';
import { verifyUser } from '../middlewares/verifyUser';

const router = express.Router();

//login
router.post('/auth/login', authController.login);
router.get("/auth/refresh-token", authController.generateAccessToken);

//OAuth  
router.post('/auth/google/callback', authController.googleAuth);

//registration
router.post("/auth/initiate-registration",authController.initiateRegistration);
router.post('/auth/register',authController.register);

//forgotPassword
router.post("/auth/forgot-password",authController.forgotPassword);
router.post("/auth/reset-password",authController.resetPassword);


router.put("/details",verifyUser,authController.updateUserProfile);
router.get("/details",verifyUser,authController.getUserData);

export default router;