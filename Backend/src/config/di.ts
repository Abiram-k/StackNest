// config/di.ts
import { AuthService } from "../services/auth.service";
import {
  UserAuthRespository,
  UserBaseRepository,
} from "../repositories/user.repository";
import { AuthController } from "../controllers/auth.controller";
import { UserProfileService } from "../services/user/user.profile.service";
import { UserProfileController } from "../controllers/user/user.profile.controller";
import { AdminController } from "../controllers/admin/admin.controller";
import { AdminService } from "../services/admin/admin.service";
import { AdminRespository } from "../repositories/admin.repository";
import { RoomService } from "../services/room.service";
import { UserRoomController } from "../controllers/user/user.room.controller";
import { RoomRespository } from "../repositories/room.repository";

// Respositories
const userAuthRepository = new UserAuthRespository();
const userBaseRepository = new UserBaseRepository();
const adminRespository = new AdminRespository();
const roomRespository = new RoomRespository();

// Services
const adminService = new AdminService(adminRespository);
const authService = new AuthService(userBaseRepository, userAuthRepository);
const userProfileService = new UserProfileService(userBaseRepository);
const roomService = new RoomService(roomRespository);

//  controllers
const adminController = new AdminController(adminService,roomService);
const authController = new AuthController(authService);
const userProfileController = new UserProfileController(userProfileService);
const userRoomController = new UserRoomController(roomService);

export {
  authController,
  userProfileController,
  adminController,
  userRoomController,
};
