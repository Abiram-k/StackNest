import express from 'express';
import { authController } from '../config/di.js';
import passport from 'passport';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

//login
router.post('/login', authController.login.bind(authController));
router.get("/refresh-token", authController.generateAccessToken.bind(authController));

// logout
router.post("/logout",authController.logout.bind(authController));

//OAuth  - Google
router.post('/google/callback', authController.googleAuth.bind(authController));

//OAuth - Github 
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login', session: false }),
  authController.githubCallback.bind(authController)
);
router.get('/validate/github/token',verifyUser,authController.validateGithubToken.bind(authController))


//registration
router.post("/initiate-registration",authController.initiateRegistration.bind(authController));
router.post('/register',authController.register.bind(authController));

//forgotPassword
router.post("/forgot-password",authController.forgotPassword.bind(authController));
router.post("/reset-password",authController.resetPassword.bind(authController));

// cloudinary-uploads
router.get("/cloudinary/sign",authController.uploadToSignedCloudinary.bind(authController));

export default router;