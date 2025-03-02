import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/IAuth";
import { UserService } from "../../services/user/user.service";

export class UserController {

  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getUserData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("No User in Req");
      const { userId } = req.user;
      if (!userId) throw new Error("User Id not get");
      const userDetails = await this.userService.getUserDetails(userId);
      console.log(userDetails)
      res.send({ success: true, userDetails, message: "User details fetched" });
    } catch (error) {
      next(error);
    }
  }


}
