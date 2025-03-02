import express from 'express';
import { verifyUser } from '../middlewares/verifyUser';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user/user.service';
import { UserController } from '../controllers/user/user.controller';

const router = express.Router();

const userRespository = new UserRepository()
const userService = new UserService(userRespository)
const userController = new UserController(userService);


// router.put("/details",verifyUser,userController.updateUserProfile.bind(userController));
router.get("/details",verifyUser,userController.getUserData.bind(userController));

export default router;
