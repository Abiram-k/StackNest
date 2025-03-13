// config/di.ts
import { AuthService } from "../services/auth.service";
import {
  UserAuthRespository,
  UserBaseRepository,
} from "../repositories/user.repository";
import { AuthController } from "../controllers/auth.controller";
import { UserProfileService } from "../services/user.profile.service";
import { UserProfileController } from "../controllers/user/user.profile.controller";
import { AdminController } from "../controllers/admin/admin.controller";
import { AdminService } from "../services/admin.service";
import { AdminRespository } from "../repositories/admin.repository";
import { RoomService } from "../services/room.service";
import { UserRoomController } from "../controllers/user/user.room.controller";
import { RoomRespository } from "../repositories/room.repository";
import {
  IUserAuthRepository,
  IUserBaseRepository,
} from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { IAdminRepository } from "../interfaces/repositories/admin.repository.interface";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { IAdminService } from "../interfaces/services/admin.service.interface";
import { IAuthService } from "../interfaces/services/auth.service.interface";
import { IUserProfileService } from "../interfaces/services/user.profile.service.interface";
import { IRoomService } from "../interfaces/services/room.service.interface";
import { IAdminController } from "../interfaces/controllers/admin.controller.interface";
import { IAuthController } from "../interfaces/controllers/auth.controller.interface";
import { IUserProfileController } from "../interfaces/controllers/user.profile.controller.interface";
import { IUserRoomController } from "../interfaces/controllers/user.room.controller.interface";

// Respositories
const userAuthRepository: IUserAuthRepository<IUser> =
  new UserAuthRespository();
const userBaseRepository: IUserBaseRepository<IUser> = new UserBaseRepository();
const adminRespository: IAdminRepository<IUser> = new AdminRespository();
const roomRespository: IRoomRepository<IRoom> = new RoomRespository();

// Services
const adminService: IAdminService = new AdminService(adminRespository);
const authService: IAuthService = new AuthService(
  userBaseRepository,
  userAuthRepository
);
const userProfileService: IUserProfileService = new UserProfileService(
  userBaseRepository
);
const roomService: IRoomService = new RoomService(roomRespository);

//  controllers
const adminController: IAdminController = new AdminController(
  adminService,
  roomService
);
const authController: IAuthController = new AuthController(authService);
const userProfileController: IUserProfileController = new UserProfileController(
  userProfileService
);
const userRoomController: IUserRoomController = new UserRoomController(
  roomService
);

export {
  authController,
  userProfileController,
  adminController,
  userRoomController,
};
