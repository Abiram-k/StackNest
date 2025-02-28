
import express from 'express';
import authController from "../controllers/admin/admin.auth.controller";

const router = express.Router();

router.post('/auth/login', authController.login);


export default router;