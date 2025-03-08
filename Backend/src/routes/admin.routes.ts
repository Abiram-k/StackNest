import express from "express";
import { adminController } from "../config/di";
import { verifyUser } from "../middlewares/verifyUser";

const router = express.Router();

router.get("/users", adminController.fetchAllUsers.bind(adminController));
router.patch(
  "/user/:userName/block",
  adminController.blockUser.bind(adminController)
);

router.get(
  "/room/available-rooms",
  adminController.fetchAllAvailableRooms.bind(adminController)
);

router.get(
  "/room/:id",
  adminController.fetchSelectedRoom.bind(adminController)
);
router.patch(
  "/room/:id",
  adminController.blockRoom.bind(adminController)
);

export default router;
