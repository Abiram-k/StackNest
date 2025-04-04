import express from "express";
import {
  adminChallengeController,
  adminController,
  adminFeedController,
  bannerController,
} from "../config/di";
import { verifyUser } from "../middlewares/verifyUser";

const router = express.Router();

// <<<<<<<<<<<<<<<<User Management>>>>>>>>>>>>>>>>>>>
router.get("/users", adminController.fetchAllUsers.bind(adminController));
router.patch(
  "/user/:userName/block",
  adminController.blockUser.bind(adminController)
);

// <<<<<<<<<<<<<<<<Room Management>>>>>>>>>>>>>>>>>>>
router.get(
  "/room/available-rooms",
  adminController.fetchAllAvailableRooms.bind(adminController)
);

router.get(
  "/room/:id",
  adminController.fetchSelectedRoom.bind(adminController)
);
router.patch("/room/:id", adminController.blockRoom.bind(adminController));
router.get("/room/:roomId/session",adminController.getRoomSessionHistory.bind(adminController));

// <<<<<<<<<<<<<<<<Banner Management>>>>>>>>>>>>>>>>>>>
router.get("/banner", bannerController.fetchBanners.bind(bannerController));
router.get(
  "/banner/:bannerId",
  bannerController.fetchSelectedBanner.bind(bannerController)
);
router.post("/banner", bannerController.addNewBanner.bind(bannerController));
router.put(
  "/banner/:bannerId",
  bannerController.updateBanner.bind(bannerController)
);
router.delete("/banner", bannerController.removeBanner.bind(bannerController));

// <<<<<<<<<<<<<<<<<Challenge Management>>>>>>>>>>>>>>>>>
router.get(
  "/challenge",
  adminChallengeController.getChallenges.bind(adminChallengeController)
);
router.post(
  "/challenge",
  adminChallengeController.addNewChallenge.bind(adminChallengeController)
);
router.put(
  "/challenge/:id",
  adminChallengeController.updateChallenge.bind(adminChallengeController)
);
router.patch(
  "/challenge/:id",
  adminChallengeController.toggleListingChallenge.bind(adminChallengeController)
);
router.delete(
  "/challenge/:id",
  adminChallengeController.removeChallenge.bind(adminChallengeController)
);

// <<<<<<<<<<<<<<<<<<<<<<<<< FEED MANAGEMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/feeds",adminFeedController.getAllFeeds.bind(adminFeedController))
router.get("/feed/:feedId",adminFeedController.getFeedDetails.bind(adminFeedController))
router.put("/feed",adminFeedController.blockOrUnblockFeed.bind(adminFeedController))
router.delete("/feed/:feedId",adminFeedController.deleteFeed.bind(adminFeedController))

export default router;
