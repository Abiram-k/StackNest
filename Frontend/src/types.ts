interface User {
  userName: string;
  email: string;
  avatar: string;
}

export interface RoomResType {
  _id: string;
  password?: string;
  roomId: string;
  title: string;
  description: string;
  host: User | string;
  isBlocked: boolean;
  startedAt: Date;
  participants: [{ user: User; totalDuration: number; lastJoined: Date }];
  isPrivate: string;
  isPremium: string;
  status: "online" | "offline" | "scheduled";
  roomType?: "normal" | "general";
  scheduledAt?: Date;
  endedAt: Date;
  limit: number;
  createdAt: Date;
}

export interface BannerReq {
  title: string;
  description: string;
  image?: string;
}
export interface BannerRes {
  _id: string;
  title: string;
  description: string;
  image?: string;
}

export type axiosResponse = {
  message: string;
  success: true;
};

export type UserBannerRes = {
  title: string;
  description: string;
  image: string;
};

export type challegeType = {
  questionNo: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
};

export type resChallengeType = {
  _id: string;
  questionNo: number;
  question: string;
  options: string[];
  answer: string;
  isListed: boolean;
};

export type RoomSessionType = {
  _id: string;
  userId: {
    userName: string;
    avatar: string;
  };
  roomId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
};

export type FeedReqType = {
  title: string;
  content: string;
  scheduledAt?: Date | null;
  media?: string;
};
export type FeedResType = {
  feedId: string;
  userId: {
    userName: string;
    avatar: string;
  };
  uploadedAt: string;
  title: string;
  content: string;
  media?: string;
  isBlocked: boolean;
  likes: number;
  comments: number;
  viewsCount: number;
};

export interface ResPremium {
  _id:string;
  title: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReqPremium {
  title: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
}

export interface PremiumFormType {
  title: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  benefit4: string;
  benefit5: string;
  benefit6: string;
}

export interface ResBenefit {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ReqBenefits {
  name: string;
  description: string;
}
