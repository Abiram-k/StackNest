// config/di.ts
import { AuthService } from "../services/auth.service";
import {
  UserAuthRespository,
  UserBaseRepository,
} from "../repositories/user.repository";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../services/user/user.service";
import { UserController } from "../controllers/user/user.controller";
import { AdminController } from "../controllers/admin/admin.controller";
import { AdminService } from "../services/admin/admin.service";
import { AdminRespository } from "../repositories/admin.repository";

// Respositories
const userAuthRepository = new UserAuthRespository();
const userBaseRepository = new UserBaseRepository();
const adminRespository = new AdminRespository();

// Services
const adminService = new AdminService(adminRespository);
const authService = new AuthService(userBaseRepository, userAuthRepository);
const userServie = new UserService(userBaseRepository);

//  controllers
const adminController = new AdminController(adminService);
const authController = new AuthController(authService);
const userController = new UserController(userServie);

export { authController, userController,adminController };
