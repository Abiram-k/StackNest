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
import { IFavoritesRepository } from "../interfaces/repositories/favorites.repository.interface";
import { FavoritesRepository } from "../repositories/favorites.repository";
import { FavoritesService } from "../services/favorites.service";
import { IFavoritesService } from "../interfaces/services/favorites.service.interface";
import { IFavoritesController } from "../interfaces/controllers/favorites.controller.interface";
import { FavoritesController } from "../controllers/user/user.favorites.controller";
import { IBannerRepository } from "../interfaces/repositories/banner.repository.interface";
import { BannerRepository } from "../repositories/banner.repository";
import { IBannerService } from "../interfaces/services/banner.service.interface";
import { BannerService } from "../services/banner.service";
import { IBannerController } from "../interfaces/controllers/banner.controller.interface";
import { BannerController } from "../controllers/admin/admin.banner.controller";
import { IBanner } from "../types/IBanner";
import { IUserBannerController } from "../interfaces/controllers/user.banner.controller.interface";
import { UserBannerController } from "../controllers/user/user.banner.controller";
import { IFavorites } from "../types/IFavorites";
import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface";
import { IChallenge } from "../types/IChallenge";
import { ChallengeRespository } from "../repositories/challenge.repository";
import { IChallengeService } from "../interfaces/services/challenge.service.interface";
import { ChallengeService } from "../services/challenge.service";
import { IUserChallengeController } from "../interfaces/controllers/user.challenge.controller.interface";
import { UserChallengeController } from "../controllers/user/user.challenge.controller";
import { IAdminChallengeController } from "../interfaces/controllers/admin.challenge.controller.interface";
import { AdminChallengeController } from "../controllers/admin/admin.challenge.controller";
import { IChallengeSubmissionRepository } from "../interfaces/repositories/challengeSubmission.repository.interface";
import { ChallengeSubmissionRepository } from "../repositories/challengeSubmission.repository";
import { IChallengeSubmission } from "../types/IChallengeSubmissionSchema";
import { IRoomSessionRepository } from "../interfaces/repositories/room.session.repository.interface";
import { IRoomSession } from "../types/IRoomSession";
import { RoomSessionRespository } from "../repositories/room.session.repository";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface";
import { IComment, IFeed } from "../types/IFeed";
import { FeedRepository } from "../repositories/feed.repository";
import { IFeedService } from "../interfaces/services/feed.service.interface";
import { FeedService } from "../services/feed.service";
import { IFeedController } from "../interfaces/controllers/user.feed.controller.interface";
import { FeedController } from "../controllers/user/user.feed.controller";
import { IAdminFeedController } from "../interfaces/controllers/admin.feed.controller.interface";
import { AdminFeedController } from "../controllers/admin/admin.feeds.controller";
import { ICommentRepository } from "../interfaces/repositories/comment.repository.interface";
import { CommentRepository } from "../repositories/comment.repository";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { IPremium } from "../types/IPremium";
import { PremiumRepository } from "../repositories/premium.repository";
import { PremiumService } from "../services/premium.service";
import { IAdminPremiumController } from "../interfaces/controllers/admin.premium.controller.interface";
import { AdminPremiumController } from "../controllers/admin/admin.premium.controller";
import { IBenefitsRepository } from "../interfaces/repositories/benefits.repository.interface";
import { IBenefit } from "../types/IBenefits";
import { BenefitsRepository } from "../repositories/benefits.repository";
import { BenefitsService } from "../services/benefits.service";
import { IAdminBenefitController } from "../interfaces/controllers/admin.benefits.controller.interface";
import { AdminBenefitsController } from "../controllers/admin/admin.benefits.controller";
import { IUserPremiumController } from "../interfaces/controllers/user.premium.controller.interface";
import { UserPremiumController } from "../controllers/user/user.premium.controller";
import { IReportRepository } from "../interfaces/repositories/report .repository.interface";
import { ReportRepository } from "../repositories/report.repository";
import { IReport } from "../types/IReport";
import { ReportService } from "../services/report.service";
import { IReportController } from "../interfaces/controllers/report.controller.interface";
import { ReportController } from "../controllers/report.controller";
import { IRewardRepository } from "../interfaces/repositories/reward.repository.interface";
import { IReward } from "../types/IReward";
import { RewardRepository } from "../repositories/reward.repository";
import { RewardService } from "../services/reward.service";
import { IAdminRewardController } from "../interfaces/controllers/admin.reward.controller.interface";
import { AdminRewardController } from "../controllers/admin/admin.reward.controller";
import { IUserRewardController } from "../interfaces/controllers/user.reward.controller.interface";
import { UserRewardController } from "../controllers/user/user.reward.controller";
import { PaymentService } from "../services/payment.service";
import { IUserPaymentController } from "../interfaces/controllers/user.payment.controller.interface";
import { UserPaymentController } from "../controllers/user/user.payment.controller";

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< REPOSITORY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const userAuthRepository: IUserAuthRepository<IUser> =
  new UserAuthRespository();
const userBaseRepository: IUserBaseRepository<IUser> = new UserBaseRepository();
const adminRespository: IAdminRepository<IUser> = new AdminRespository();
const roomRespository: IRoomRepository<IRoom> = new RoomRespository();
const roomSessionRespository: IRoomSessionRepository<IRoomSession> =
  new RoomSessionRespository();
const favoritesRepository: IFavoritesRepository<IFavorites> =
  new FavoritesRepository();
const bannerRepository: IBannerRepository<IBanner> = new BannerRepository();
const challengeRepository: IChallengeRespository<IChallenge> =
  new ChallengeRespository();
const challengeSubmissionRespository: IChallengeSubmissionRepository<IChallengeSubmission> =
  new ChallengeSubmissionRepository();
const feedRepository: IFeedRepository<IFeed> = new FeedRepository();
const commentRepository: ICommentRepository<IComment> = new CommentRepository();
const premiumRepository: IPremiumRepository<IPremium> = new PremiumRepository();
const benefitsRepository: IBenefitsRepository<IBenefit> =
  new BenefitsRepository();
const reportRepository: IReportRepository<IReport> = new ReportRepository();
const rewardRepository: IRewardRepository<IReward> = new RewardRepository();

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SERVICES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const adminService: IAdminService = new AdminService(adminRespository);
const authService: IAuthService = new AuthService(
  userBaseRepository,
  userAuthRepository
);
const userProfileService: IUserProfileService = new UserProfileService(
  userBaseRepository,
  feedRepository
);
const roomService: IRoomService = new RoomService(
  roomRespository,
  userBaseRepository,
  roomSessionRespository
);
const favoritesService: IFavoritesService = new FavoritesService(
  favoritesRepository,
  userBaseRepository
);
const bannerServie: IBannerService = new BannerService(bannerRepository);
const challengeServie: IChallengeService = new ChallengeService(
  challengeRepository,
  userBaseRepository,
  challengeSubmissionRespository
);
const feedService: IFeedService = new FeedService(
  feedRepository,
  userBaseRepository,
  commentRepository
);
const premiumService = new PremiumService(
  premiumRepository,
  benefitsRepository
);
const benefitsService = new BenefitsService(benefitsRepository);
const reportService = new ReportService(
  reportRepository,
  roomRespository,
  userBaseRepository
);
const rewardService = new RewardService(rewardRepository, userBaseRepository);
const paymentService = new PaymentService(userBaseRepository,premiumRepository);

//  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CONTROLLERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
const favoritesController: IFavoritesController = new FavoritesController(
  favoritesService
);
const adminFeedController: IAdminFeedController = new AdminFeedController(
  feedService
);
const bannerController: IBannerController = new BannerController(bannerServie);

const userBannerController: IUserBannerController = new UserBannerController(
  bannerServie
);
const userChallengeController: IUserChallengeController =
  new UserChallengeController(challengeServie);
const adminChallengeController: IAdminChallengeController =
  new AdminChallengeController(challengeServie);
const feedController: IFeedController = new FeedController(feedService);
const adminPremiumController: IAdminPremiumController =
  new AdminPremiumController(premiumService);
const adminBenefitsController: IAdminBenefitController =
  new AdminBenefitsController(benefitsService);
const userPremiumController: IUserPremiumController = new UserPremiumController(
  premiumService
);
const reportController: IReportController = new ReportController(reportService);
const adminRewardController: IAdminRewardController = new AdminRewardController(
  rewardService
);
const userRewardController: IUserRewardController = new UserRewardController(
  rewardService
);
const paymentController: IUserPaymentController = new UserPaymentController(
  paymentService
);

export {
  authController,
  userProfileController,
  adminController,
  userRoomController,
  favoritesController,
  adminFeedController,
  bannerController,
  userBannerController,
  userChallengeController,
  adminChallengeController,
  feedController,
  adminPremiumController,
  adminBenefitsController,
  userPremiumController,
  reportController,
  adminRewardController,
  userRewardController,
  paymentController
};
