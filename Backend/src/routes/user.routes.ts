import express from "express";
import {
  favoritesController,
  feedController,
  userBannerController,
  userChallengeController,
  userProfileController,
  userRoomController,
} from "../config/di";

const router = express.Router();

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PROFILE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.put(
  "/details",
  userProfileController.updateUserProfile.bind(userProfileController)
);
router.get(
  "/details",
  userProfileController.getUserData.bind(userProfileController)
);
router.patch(
  "/checkin",
  userProfileController.checkinUser.bind(userProfileController)
);
router.get(
  "/streak",
  userProfileController.getUserStreakCount.bind(userProfileController)
);
router.get(
  "/card/data",
  userProfileController.getCardData.bind(userProfileController)
);
router.get(
  "/challenge-points",
  userProfileController.getChallengePoints.bind(userProfileController)
);
router.get(
  "/stats",
  userProfileController.getStatsData.bind(userProfileController)
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

// <<<<<<<<<<<<<<<<<<<<<<<< Banner >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get(
  "/banner",
  userBannerController.fetchBanners.bind(userBannerController)
);

// <<<<<<<<<<<<<<<<<<<<<<<< Challenge >>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get(
  "/challenge",
  userChallengeController.getChallenges.bind(userChallengeController)
);
router.post(
  "/challenge/:challengeId",
  userChallengeController.submitChallenge.bind(userChallengeController)
);
router.get(
  "/submitted-challenges",
  userChallengeController.getUserSubmittedChallenge.bind(
    userChallengeController
  )
);

// <<<<<<<<<<<<<<<<<<<<<<<<<< FEEDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get(
  "/suggestion",
  feedController.getUserSearchSuggestion.bind(feedController)
);
router.get(
  "/available-feeds",
  feedController.getAllAvailableFeed.bind(feedController)
);
router.get(
  "/feed/:feedId",
  feedController.getSingleFeedData.bind(feedController)
);
router.get("/my-feed", feedController.getMyFeeds.bind(feedController));
router.get(
  "/feeds/my-likes",
  feedController.getLikedFeeds.bind(feedController)
);
router.get(
  "/feeds/my-comments",
  feedController.getUserComments.bind(feedController)
);
router.get(
  "/feed/:feedId",
  feedController.getSelectedFeed.bind(feedController)
);
router.post("/feed", feedController.uploadFeed.bind(feedController));
router.post("/feed/comment", feedController.postComment.bind(feedController)); // Post comment
router.get(
  "/feed/comment/:feedId",
  feedController.getComments.bind(feedController)
); // Get comments
router.get(
  "/feed-comment/replies",
  feedController.getCommentReplies.bind(feedController)
); // Get comment replies
router.patch(
  "/feed/:feedId/views",
  feedController.incrementViewsCount.bind(feedController)
); // Get comment replies

router.delete(
  "/feed/comment",
  feedController.deleteComment.bind(feedController)
);

router.post("/feed/like", feedController.toggleLikeFeed.bind(feedController));
router.put("/feed/:feedId", feedController.updateFeed.bind(feedController));
router.delete("/feed/:feedId", feedController.deleteFeed.bind(feedController));

// <<<<<<<<<<<<<<<<<<<<<<<<<<< PUSH NOTIFICATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post(
  "/subscribe",
  userProfileController.subscribeUserForPushNotification.bind(
    userProfileController
  )
);

export default router;
