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
  participants: [{ user: User; joinedAt: Date; leavedAt: Date }];
  isPrivate: string;
  isPremium: string;
  status: "online" | "offline" | "scheduled";
  roomType?: "normal" | "general";
  scheduledAt?: Date;
  endedAt: Date;
  limit: number;
  createdAt: Date;
}

export interface BannerReq{
  title:string;
  description:string;
  image?:string;
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
}