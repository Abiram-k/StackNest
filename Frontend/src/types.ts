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
  participants: [{ user: User; totalDuration: number; lastJoined: Date;}];
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
  // options: string[];
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  // isListed: boolean;
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
  _id:string;
    userId: {
      userName:string,
      avatar:string
    };
    roomId: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
  
}