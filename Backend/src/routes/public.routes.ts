
import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

//login
router.post('/login', AuthController.login);
router.get("/refresh-token", AuthController.generateAccessToken);

//registration
router.post("/initiate-registration",AuthController.initiateRegistration)
router.post('/register',AuthController.register)


//forgotPassword
router.post("/forgot-password",AuthController.forgotPassword);
router.post("/reset-password",AuthController.resetPassword)

export default router;