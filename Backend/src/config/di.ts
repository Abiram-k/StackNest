// config/di.ts
import { AuthService } from "../services/auth.service.js";
import {
  UserAuthRespository,
  UserBaseRepository,
} from "../repositories/user.repository.js";
import { AuthController } from "../controllers/auth.controller.js";
import { UserProfileService } from "../services/user.profile.service.js";
import { UserProfileController } from "../controllers/user/user.profile.controller.js";
import { AdminController } from "../controllers/admin/admin.controller.js";
import { AdminService } from "../services/admin.service.js";
import { AdminRespository } from "../repositories/admin.repository.js";
import { RoomService } from "../services/room.service.js";
import { UserRoomController } from "../controllers/user/user.room.controller.js";
import { RoomRespository } from "../repositories/room.repository.js";
import {
  IUserAuthRepository,
  IUserBaseRepository,
} from "../interfaces/repositories/user.repository.interface.js";
import { IUser } from "../types/IUser.js";
import { IAdminRepository } from "../interfaces/repositories/admin.repository.interface.js";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface.js";
import { IRoom } from "../types/IRoom.js";
import { IAdminService } from "../interfaces/services/admin.service.interface.js";
import { IAuthService } from "../interfaces/services/auth.service.interface.js";
import { IUserProfileService } from "../interfaces/services/user.profile.service.interface.js";
import { IRoomService } from "../interfaces/services/room.service.interface.js";
import { IAdminController } from "../interfaces/controllers/admin.controller.interface.js";
import { IAuthController } from "../interfaces/controllers/auth.controller.interface.js";
import { IUserProfileController } from "../interfaces/controllers/user.profile.controller.interface.js";
import { IUserRoomController } from "../interfaces/controllers/user.room.controller.interface.js";
import { IFavoritesRepository } from "../interfaces/repositories/favorites.repository.interface.js";
import { FavoritesRepository } from "../repositories/favorites.repository.js";
import { FavoritesService } from "../services/favorites.service.js";
import { IFavoritesService } from "../interfaces/services/favorites.service.interface.js";
import { IFavoritesController } from "../interfaces/controllers/favorites.controller.interface.js";
import { FavoritesController } from "../controllers/user/user.favorites.controller.js";
import { IBannerRepository } from "../interfaces/repositories/banner.repository.interface.js";
import { BannerRepository } from "../repositories/banner.repository.js";
import { IBannerService } from "../interfaces/services/banner.service.interface.js";
import { BannerService } from "../services/banner.service.js";
import { IBannerController } from "../interfaces/controllers/banner.controller.interface.js";
import { BannerController } from "../controllers/admin/admin.banner.controller.js";
import { IBanner } from "../types/IBanner.js";
import { IUserBannerController } from "../interfaces/controllers/user.banner.controller.interface.js";
import { UserBannerController } from "../controllers/user/user.banner.controller.js";
import { IFavorites } from "../types/IFavorites.js";
import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface.js";
import { IChallenge } from "../types/IChallenge.js";
import { ChallengeRespository } from "../repositories/challenge.repository.js";
import { IChallengeService } from "../interfaces/services/challenge.service.interface.js";
import { ChallengeService } from "../services/challenge.service.js";
import { IUserChallengeController } from "../interfaces/controllers/user.challenge.controller.interface.js";
import { UserChallengeController } from "../controllers/user/user.challenge.controller.js";
import { IAdminChallengeController } from "../interfaces/controllers/admin.challenge.controller.interface.js";
import { AdminChallengeController } from "../controllers/admin/admin.challenge.controller.js";
import { IChallengeSubmissionRepository } from "../interfaces/repositories/challengeSubmission.repository.interface.js";
import { ChallengeSubmissionRepository } from "../repositories/challengeSubmission.repository.js";
import { IChallengeSubmission } from "../types/IChallengeSubmissionSchema.js";
import { IRoomSessionRepository } from "../interfaces/repositories/room.session.repository.interface.js";
import { IRoomSession } from "../types/IRoomSession.js";
import { RoomSessionRespository } from "../repositories/room.session.repository.js";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface.js";
import { IComment, IFeed } from "../types/IFeed.js";
import { FeedRepository } from "../repositories/feed.repository.js";
import { IFeedService } from "../interfaces/services/feed.service.interface.js";
import { FeedService } from "../services/feed.service.js";
import { IFeedController } from "../interfaces/controllers/user.feed.controller.interface.js";
import { FeedController } from "../controllers/user/user.feed.controller.js";
import { IAdminFeedController } from "../interfaces/controllers/admin.feed.controller.interface.js";
import { AdminFeedController } from "../controllers/admin/admin.feeds.controller.js";
import { ICommentRepository } from "../interfaces/repositories/comment.repository.interface.js";
import { CommentRepository } from "../repositories/comment.repository.js";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface.js";
import { IPremium } from "../types/IPremium.js";
import { PremiumRepository } from "../repositories/premium.repository.js";
import { PremiumService } from "../services/premium.service.js";
import { IAdminPremiumController } from "../interfaces/controllers/admin.premium.controller.interface.js";
import { AdminPremiumController } from "../controllers/admin/admin.premium.controller.js";
import { IBenefitsRepository } from "../interfaces/repositories/benefits.repository.interface.js";
import { IBenefit } from "../types/IBenefits.js";
import { BenefitsRepository } from "../repositories/benefits.repository.js";
import { BenefitsService } from "../services/benefits.service.js";
import { IAdminBenefitController } from "../interfaces/controllers/admin.benefits.controller.interface.js";
import { AdminBenefitsController } from "../controllers/admin/admin.benefits.controller.js";
import { IUserPremiumController } from "../interfaces/controllers/user.premium.controller.interface.js";
import { UserPremiumController } from "../controllers/user/user.premium.controller.js";
import { IReportRepository } from "../interfaces/repositories/report .repository.interface.js";
import { ReportRepository } from "../repositories/report.repository.js";
import { IReport } from "../types/IReport.js";
import { ReportService } from "../services/report.service.js";
import { IReportController } from "../interfaces/controllers/report.controller.interface.js";
import { ReportController } from "../controllers/report.controller.js";
import { IRewardRepository } from "../interfaces/repositories/reward.repository.interface.js";
import { IReward } from "../types/IReward.js";
import { RewardRepository } from "../repositories/reward.repository.js";
import { RewardService } from "../services/reward.service.js";
import { IAdminRewardController } from "../interfaces/controllers/admin.reward.controller.interface.js";
import { AdminRewardController } from "../controllers/admin/admin.reward.controller.js";
import { IUserRewardController } from "../interfaces/controllers/user.reward.controller.interface.js";
import { UserRewardController } from "../controllers/user/user.reward.controller.js";
import { PaymentService } from "../services/payment.service.js";
import { IUserPaymentController } from "../interfaces/controllers/user.payment.controller.interface.js";
import { UserPaymentController } from "../controllers/user/user.payment.controller.js";
import { INotificationRepository } from "../interfaces/repositories/notification.repository.interface.js";
import { INotification } from "../types/INotification.js";
import { NotificationRepository } from "../repositories/notification.repository.js";
import { ConnectionService } from "../services/connection.service.js";
import { IConnectionService } from "../interfaces/services/connection.service.interface.js";
import { IRewardService } from "../interfaces/services/reward.service.interface.js";
import { IPaymentService } from "../interfaces/services/payment.service.interface.js";
import { IReportService } from "../interfaces/services/report.service.interface.js";
import { IBenefitsService } from "../interfaces/services/benefits.service.interface.js";
import { IPremiumService } from "../interfaces/services/premium.service.interface.js";
import { IUserConnectionController } from "../interfaces/controllers/user.connection.controller.interface.js";
import { UserConnectionController } from "../controllers/user/user.connection.controller.js";
import { IMessageRepository } from "../interfaces/repositories/message.repository.interface.js";
import { IMessage } from "../types/IMessage.js";
import { MessageRepository } from "../repositories/message.repository.js";
import { ICallRepository } from "../interfaces/repositories/call.repository.interface.js";
import { ICallLog } from "../types/ICallLog.js";
import { CallRepository } from "../repositories/call.repository.js";

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
const notificationRepository: INotificationRepository<INotification> =
  new NotificationRepository();
const messageRepository: IMessageRepository<IMessage> = new MessageRepository();
const callRepository: ICallRepository<ICallLog> = new CallRepository();

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SERVICES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const adminService: IAdminService = new AdminService(
  adminRespository,
  roomRespository,
  premiumRepository,
  userBaseRepository
);
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
const premiumService: IPremiumService = new PremiumService(
  premiumRepository,
  benefitsRepository,
  userBaseRepository
);
const benefitsService: IBenefitsService = new BenefitsService(
  benefitsRepository
);
const reportService: IReportService = new ReportService(
  reportRepository,
  roomRespository,
  userBaseRepository
);
const rewardService: IRewardService = new RewardService(
  rewardRepository,
  userBaseRepository
);
const paymentService: IPaymentService = new PaymentService(
  userBaseRepository,
  premiumRepository
);
const connectionService: IConnectionService = new ConnectionService(
  notificationRepository,
  userBaseRepository,
  messageRepository,
  callRepository
);

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
const userConnectionController: IUserConnectionController =
  new UserConnectionController(connectionService);

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
  paymentController,
  userConnectionController,
};
