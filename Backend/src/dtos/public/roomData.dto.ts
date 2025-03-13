import { Types } from "mongoose";

interface UserDTO {
  userName: string;
  email: string;
  avatar: string;
}

export interface RoomResTypeDTO {
  _id: string;
  password?: string;
  roomId: string;
  title: string;
  description: string;
  host: UserDTO | Types.ObjectId;
  isBlocked: boolean;
  startedAt: Date;
  participants: [
    { user: Types.ObjectId | UserDTO; joinedAt: Date; leavedAt: Date }
  ];
  isPrivate: string;
  isPremium: string;
  status: "online" | "offline" | "scheduled";
  scheduledAt?: Date;
  endedAt: Date;
  limit: number;
  createdAt: Date;
}
