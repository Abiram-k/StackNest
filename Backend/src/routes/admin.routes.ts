import express from "express";
import {
  adminBenefitsController,
  adminChallengeController,
  adminController,
  adminFeedController,
  adminPremiumController,
  adminRewardController,
  bannerController,
  reportController,
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
router.get(
  "/room/:roomId/session",
  adminController.getRoomSessionHistory.bind(adminController)
);

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
router.get("/feeds", adminFeedController.getAllFeeds.bind(adminFeedController));
router.get(
  "/feed/:feedId",
  adminFeedController.getFeedDetails.bind(adminFeedController)
);
router.put(
  "/feed",
  adminFeedController.blockOrUnblockFeed.bind(adminFeedController)
);
router.delete(
  "/feed/:feedId",
  adminFeedController.deleteFeed.bind(adminFeedController)
);

// <<<<<<<<<<<<<<<<<<<<<<<<< PREMIUM-PLANS MANAGEMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.get(
  "/premium-plans",
  adminPremiumController.getAllPremium.bind(adminPremiumController)
);
router.get(
  "/premium-plan/:premiumId",
  adminPremiumController.getSelectedPremium.bind(adminPremiumController)
);
router.post(
  "/premium-plan",
  adminPremiumController.addPremium.bind(adminPremiumController)
);
router.put(
  "/premium-plan/:premiumId",
  adminPremiumController.updatePremium.bind(adminPremiumController)
);
router.patch(
  "/premium-plan/:premiumId",
  adminPremiumController.toggleListPremium.bind(adminPremiumController)
);
router.delete(
  "/premium-plan/:premiumId",
  adminPremiumController.removePremium.bind(adminPremiumController)
);

// <<<<<<<<<<<<<<<<<<<<<<<<< BENEFITS MANAGEMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.get(
  "/benefits",
  adminBenefitsController.getAllBenefits.bind(adminBenefitsController)
);
router.get(
  "/benefit/:benefitId",
  adminBenefitsController.getSelectedBenefits.bind(adminBenefitsController)
);
router.get(
  "/benefits-active",
  adminBenefitsController.getActiveBenefits.bind(adminBenefitsController)
);
router.post(
  "/benefit",
  adminBenefitsController.addBenefits.bind(adminBenefitsController)
);
router.put(
  "/benefit/:benefitId",
  adminBenefitsController.updateBenefits.bind(adminBenefitsController)
);
router.patch(
  "/benefit/:benefitId",
  adminBenefitsController.toggleListing.bind(adminBenefitsController)
);
router.delete(
  "/benefit/:benefitId",
  adminBenefitsController.removeBenefits.bind(adminBenefitsController)
);


// <<<<<<<<<<<<<<<<<<<<<<<<< REWARD MANAGEMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.get(
  "/rewards",
  adminRewardController.getAllReward.bind(adminRewardController)
);
router.get(
  "/reward/:rewardId",
  adminRewardController.getSelectedReward.bind(adminRewardController)
);
// router.get(
//   "/rewards-active",
//   adminRewardController.getActiveReward.bind(adminRewardController)
// );
router.post(
  "/reward",
  adminRewardController.addReward.bind(adminRewardController)
);
router.put(
  "/reward/:rewardId",
  adminRewardController.updateReward.bind(adminRewardController)
);
router.patch(
  "/reward/:rewardId",
  adminRewardController.toggleListing.bind(adminRewardController)
);
router.delete(
  "/reward/:rewardId",
  adminRewardController.removeReward.bind(adminRewardController)
);

// <<<<<<<<<<<<<<<<<<<<<<<< REPORT MANAGEMENT >>>>>>>>>>>>>>>>>>>>>>>
router.get("/reports",reportController.getAllReports.bind(reportController))
router.post("/report/resolve",reportController.resolveReport.bind(reportController))
router.post("/report/reject",reportController.rejectReport.bind(reportController))

// <<<<<<<<<<<<<<<<<<<<<<<<< Dashboard >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/user-engagement",adminController.getUserEngagement.bind(adminController))
router.get("/sales/details",adminController.getSalesDetails.bind(adminController))

export default router;
