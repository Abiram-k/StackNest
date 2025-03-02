
import express from 'express';
import {AdminController} from "../controllers/admin/admin.controller";
import { UserRepository } from '../repositories/user.repository';
import { AdminService } from '../services/admin/admin.auth.service';

const router = express.Router();

const adminRespository = new UserRepository()
const adminService = new AdminService(adminRespository)
const adminController = new AdminController(adminService);

// auth 
router.post('/auth/login', adminController.login.bind(adminController));

//


export default router;