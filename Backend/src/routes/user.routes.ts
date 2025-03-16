import express from "express";
import {
  favoritesController,
  userBannerController,
  userProfileController,
  userRoomController,
} from "../config/di";

const router = express.Router();

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CHATBOT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post(
  "/chatbot",
  userProfileController.chatBotResponse.bind(userProfileController)
);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PROFILE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.put(
  "/details",
  userProfileController.updateUserProfile.bind(userProfileController)
);

router.get(
  "/details",
  userProfileController.getUserData.bind(userProfileController)
);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROOMS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< FAVORITES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get(
  "/favorites",
  favoritesController.fetchFavorites.bind(favoritesController)
);
router.post(
  "/favorites",
  favoritesController.addToFavorites.bind(favoritesController)
);
router.delete(
  "/favorites",
  favoritesController.removeFromFavorites.bind(favoritesController)
);

// <<<<<<<<<<<<<<<<<<<<<<<< Banner >>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
router.get(
  "/banner",
  userBannerController.fetchBanners.bind(userBannerController)
);

export default router;
