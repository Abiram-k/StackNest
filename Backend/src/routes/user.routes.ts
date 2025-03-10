import express from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { userProfileController, userRoomController } from "../config/di";

const router = express.Router();

router.post(
  "/chatbot",
  userProfileController.chatBotResponse.bind(userProfileController)
);

// profile
router.put(
  "/details",
  userProfileController.updateUserProfile.bind(userProfileController)
);

router.get(
  "/details",
  userProfileController.getUserData.bind(userProfileController)
);

//room
router.post("/room", userRoomController.createRoom.bind(userRoomController));
router.put("/room", userRoomController.updateRoom.bind(userRoomController));

router.get(
  "/room/my-rooms",
  userRoomController.fetchMyRooms.bind(userRoomController)
);
router.get(
  "/room/available-rooms",
  userRoomController.fetchAllAvailableRooms.bind(userRoomController)
);

router.get(
  "/room/:id",
  userRoomController.fetchSelectedRoom.bind(userRoomController)
);

router.delete(
  "/room/:id",
  userRoomController.removeRoom.bind(userRoomController)
);

router.post("/room/join", userRoomController.joinRoom.bind(userRoomController));

router.post(
  "/room/verify-password/:roomId",
  userRoomController.verifyPassword.bind(userRoomController)
);

export default router;
