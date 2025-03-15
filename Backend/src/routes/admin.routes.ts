import express from "express";
import { adminController, bannerController } from "../config/di";
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

// <<<<<<<<<<<<<<<<Banner Management>>>>>>>>>>>>>>>>>>>
router.get("/banner", bannerController.fetchBanners.bind(bannerController));
router.post("/banner", bannerController.addNewBanner.bind(bannerController));
router.put("/banner", bannerController.updateBanner.bind(bannerController));
router.delete("/banner", bannerController.removeBanner.bind(bannerController));

export default router;
