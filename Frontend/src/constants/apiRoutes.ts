
//////////////////////////////// USER ROUTES /////////////////////////////////////

export const USER_CHALLENGE_ROUTES = {
  FETCH_CHALLENGES: "/users/challenge",
  GET_SUBMITTED_CHALLENGES: "/users/submitted-challenges",
  SUBMIT_CHALLENGE: (challengeId: string) => `/users/challenge/${challengeId}`,
};

export const CONNECTION_ROUTES = {
  SEND_CONNECTION_REQUEST: "/users/connection/request",
  GET_CONNECTION_REQUEST: "/users/connection/request",
  GET_NOTIFICATIONS: "/users/notifications",
  REJECT_REQUEST: "/users/connection/reject",
  ACCEPT_REQUEST: "/users/connection/accept",
  UNFOLLOW:"/users/connection/unfollow",
  GET_ALL_CONNECTIONS: (search: string) =>
    `/users/connection/all?search=${search}`,
  SEND_MESSAGE: (friendId: string) =>
    `/users/connection/message?friendId=${friendId}`, 
  GET_MESSAGES: (friendId: string) =>
    `/users/connection/message?friendId=${friendId}`,
  FETCH_CALL_LOGS: "/users/connection/call_logs",
  TOGGLE_IS_READ: (messageId: string) =>
    `/users/connection/message/read/${messageId}`,
  UNREAD_MESSAGE_COUNT: "/users/connection/message/unread/count",
  DELETE_MESSAGE: (messageId: string) =>
    `/users/connection/message/${messageId}`,
};

export const FAVORITE_ROUTES = {
  FETCH_FAVORITES: "/users/favorites",
  ADD_TO_FAVORITES: "/users/favorites",
  REMOVE_FROM_FAVORITES: (roomId: string) => `/users/favorites?roomId=${roomId}`,
};

export const PREMIUM_ROUTES = {
  GET_LISTED_PREMIUM: "/users/premium-plans",
  GET_SELECTED_PREMIUM: (planId: string) => `/users/premium-plan/${planId}`,
  GET_PREMIUM_HISTORY: "/users/premium-plans/history",
};

export const BANNER_ROUTES = {
  FETCH_USER_BANNERS: "/users/banner",
};

export const USER_PROFILE_ROUTES = {
  GET_OPENAI_RESPONSE: "/users/chatbot",
  GET_USER_PROFILE: "/users/details",
  UPDATE_USER_PROFILE: "/users/details",
  CHECKIN: "/users/checkin",
  GET_STREAK_COUNT: "/users/streak",
  GET_FRIEND_SUGGESTION: "/users/friends/suggestion",
  GET_STATS_LEADERBOARD: "/users/stats",
  GET_USER_CARD_DATA: "/users/card/data",
  FETCH_CHALLENGE_POINTS: "users/challenge-points",
  REPORT: "/users/report",
  GET_INSPECT_DATA: (userName: string) => `/users/${userName}/inspect`,
};

/////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////// 🌍 PUBLIC ROUTES 🌍//////////////////////////////////////

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  INITIATE_REGISTRATION: "/auth/initiate-registration",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const BENEFIT_ROUTES = {
  GET_ALL_BENEFITS: (currentPage: number, limit: number) =>
    `/admin/benefits?currentPage=${currentPage}&limit=${limit}`,
  GET_ACTIVE_BENEFITS: "/admin/benefits-active",
  GET_SELECTED_BENEFIT: (benefitId: string) => `/admin/benefit/${benefitId}`,
  ADD_BENEFIT: "/admin/benefit",
  UPDATE_BENEFIT: (benefitId: string) => `/admin/benefit/${benefitId}`,
  TOGGLE_LISTING: (benefitId: string) => `/admin/benefit/${benefitId}`,
  REMOVE_BENEFIT: (benefitId: string) => `/admin/benefit/${benefitId}`,
};


export const FEED_ROUTES = {
  USER_UPLOAD_FEED: "/users/feed",
  USER_MY_FEEDS: "/users/my-feed",
  USER_DELETE_COMMENT: (feedId: string, commentId: string) =>
    `/users/feed/comment?feedId=${feedId}&commentId=${commentId}`,
  USER_UPDATE_FEED: (feedId: string) => `/users/feed/${feedId}`,
  USER_SELECTED_FEED: (feedId: string) => `/users/feed/${feedId}`,
  USER_DELETE_FEED: (feedId: string) => `/users/feed/${feedId}`,
  USER_AVAILABLE_FEEDS: (filter: string, sort: string, limit: number, page: number) =>
    `users/available-feeds?filter=${filter}&sort=${sort}&limit=${limit}&page=${page}`,
  USER_SINGLE_FEED: (feedId: string) => `/users/feed/${feedId}`,
  USER_LIKED_FEEDS: "users/feeds/my-likes",
  USER_COMMENTED_FEEDS: "users/feeds/my-comments",
  USER_TOGGLE_LIKE: "users/feed/like",
  USER_SUGGESTIONS: (search: string) => `/users/suggestion?&search=${search}`,
  USER_POST_COMMENT: (feedId: string) => `/users/feed/comment?feedId=${feedId}`,
  USER_GET_COMMENTS: (feedId: string) => `/users/feed/comment/${feedId}`,
  USER_GET_REPLIES: (feedId: string, parentCommentId: string) =>
    `/users/feed-comment/replies?feedId=${feedId}&parentCommentId=${parentCommentId}`,
  USER_INCREMENT_VIEWS: (feedId: string) => `/users/feed/${feedId}/views`,

  ADMIN_GET_ALL_FEEDS: (search: string, filter: string, sort: string, page: number, limit: number) =>
    `/admin/feeds?search=${search}&filter=${filter}&sort=${sort}&page=${page}&limit=${limit}`,
  ADMIN_BLOCK_UNBLOCK_FEED: "/admin/feed",
  ADMIN_DELETE_FEED: (feedId: string) => `/admin/feed/${feedId}`,
  ADMIN_FEED_DETAILS: (feedId: string) => `/admin/feed/${feedId}`,
  ADMIN_REMOVE_FEED: (feedId: string, reason: string) =>
    `/admin/feed/${feedId}?reason=${reason}`,
};

export const IMAGE_ROUTES = {
  GET_CLOUDINARY_CREDENTIALS: "/auth/cloudinary/sign",
};

export const NOTIFICATION_ROUTES = {
  SUBSCRIBE_USER: "/users/subscribe",
};

export const REWARD_ROUTES = {
  ADMIN_ALL_REWARDS: "/admin/rewards",
  ADMIN_SELECTED_REWARD: (rewardId: string) => `/admin/reward/${rewardId}`,
  ADMIN_ADD_REWARD: "/admin/reward",
  ADMIN_UPDATE_REWARD: (rewardId: string) => `/admin/reward/${rewardId}`,
  ADMIN_TOGGLE_LISTING: (rewardId: string) => `/admin/reward/${rewardId}`,
  ADMIN_REMOVE_REWARD: (rewardId: string) => `/admin/reward/${rewardId}`,

  USER_ACTIVE_REWARDS: "/users/rewards-active",
  USER_CLAIM_REWARD: "/users/reward/claim",
  USER_CLAIMED_REWARDS: "/users/reward/claim",
};

export const ROOM_ROUTES = {
  CREATE_ROOM: "users/room",
  UPDATE_ROOM: (id: string) => `users/room?id=${id}`,
  MY_ROOMS: "users/room/my-rooms",
  AVAILABLE_ROOMS: (role: string, filters: string) =>
    `${role}/room/available-rooms${filters}`,
  SELECTED_ROOM: (role: string, id: string) => `${role}/room/${id}`,
  DELETE_ROOM: (id: string) => `users/room/${id}`,
  BLOCK_ROOM: (id: string) => `admin/room/${id}`,
  JOIN_ROOM: "users/room/join",
  VERIFY_PASSWORD: (roomId: string) => `users/room/verify-password/${roomId}`,
  FETCH_ROOM_SESSION: (roomId: string, role: string, filters: string) =>
    `${role}/room/${roomId}/session${filters}`,
};
////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////// ADMIN ROUTES /////////////////////////////////


export const ADMIN_ROUTES = {
  USERS: (filter: string) => `/admin/users${filter}`,
  REPORTS: (filter: string) => `/admin/reports${filter}`,
  SALES_DETAILS: (type: string, month?: string) =>
    `/admin/sales/details?type=${type}&month=${month}`,
  REPORT_RESOLVE: `/admin/report/resolve`,
  REPORT_REJECT: `/admin/report/reject`,
  BLOCK_USER: (userName: string) => `/admin/user/${userName}/block`,
  USER_ENGAGEMENT: (year: number) => `/admin/user-engagement?year=${year}`,
};


export const ADMIN_BANNER_ROUTES = {
  GET_ALL: "/admin/banner",
  GET_SELECTED: (bannerId: string) => `/admin/banner/${bannerId}`,
  CREATE: "/admin/banner",
  UPDATE: (bannerId: string) => `/admin/banner/${bannerId}`,
  DELETE: (bannerId: string) => `/admin/banner?bannerId=${bannerId}`,
};

export const ADMIN_CHALLENGE_ROUTES = {
  ADD: "/admin/challenge",
  GET_ALL: (limit: number, currentPage?: number) =>
    `/admin/challenge?limit=${limit}&currentPage=${currentPage}`,
  UPDATE: (challengeId: string) => `/admin/challenge/${challengeId}`,
  DELETE: (challengeId: string) => `/admin/challenge/${challengeId}`,
  TOGGLE: (challengeId: string) => `/admin/challenge/${challengeId}`,
};

// src/constants/apiRoutes.ts

export const ADMIN_PREMIUM_PLAN_ROUTES = {
  GET_ALL: (currentPage: number, limit: number) =>
    `/admin/premium-plans?currentPage=${currentPage}&limit=${limit}`,
  GET_SELECTED: (premiumId: string) => `/admin/premium-plan/${premiumId}`,
  ADD: `/admin/premium-plan`,
  UPDATE: (premiumId: string) => `/admin/premium-plan/${premiumId}`,
  DELETE: (premiumId: string) => `/admin/premium-plan/${premiumId}`,
  TOGGLE_LIST: (premiumId: string) => `/admin/premium-plan/${premiumId}`,
};
