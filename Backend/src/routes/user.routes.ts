import express from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { userProfileController, userRoomController } from "../config/di";

const router = express.Router();

// profile
router.put(
  "/details",
  verifyUser,
  userProfileController.updateUserProfile.bind(userProfileController)
);
router.get(
  "/details",
  verifyUser,
  userProfileController.getUserData.bind(userProfileController)
);

//room
router.post(
  "/room",
  verifyUser,
  userRoomController.createRoom.bind(userRoomController)
);
router.put(
  "/room",
  verifyUser,
  userRoomController.updateRoom.bind(userRoomController)
);

router.get(
  "/rooms/my-rooms",
  verifyUser,
  userRoomController.fetchMyRooms.bind(userRoomController)
);
router.get(
  "/rooms/available-rooms",
  verifyUser,
  userRoomController.fetchAllAvailableRooms.bind(userRoomController)
);


export default router;
