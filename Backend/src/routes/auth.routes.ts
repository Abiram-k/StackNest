import express from 'express';
import {UserAuthController} from '../controllers/user/user.auth.controller';
import { UserAuthService } from '../services/user/user.auth.service';
import { UserRepository } from '../repositories/user.repository';

const router = express.Router();

const userRespository = new UserRepository()
const userAuthService = new UserAuthService(userRespository)
const userAuthController = new UserAuthController(userAuthService);
//login
router.post('/login', userAuthController.login.bind(userAuthController));
router.get("/refresh-token", userAuthController.generateAccessToken.bind(userAuthController));

//OAuth  
router.post('/google/callback', userAuthController.googleAuth.bind(userAuthController));

//registration
router.post("/initiate-registration",userAuthController.initiateRegistration.bind(userAuthController));
router.post('/register',userAuthController.register.bind(userAuthController));

//forgotPassword
router.post("/forgot-password",userAuthController.forgotPassword.bind(userAuthController));
router.post("/reset-password",userAuthController.resetPassword.bind(userAuthController));


export default router;