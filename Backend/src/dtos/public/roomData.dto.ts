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
    { user: Types.ObjectId | UserDTO; totalDuration: number; lastJoined: Date }
  ];
  isPrivate: string;
  isPremium: string;
  status: "online" | "offline" | "scheduled";
  roomType: "normal" | "general";
  scheduledAt?: Date;
  endedAt: Date;
  limit: number; 
  createdAt: Date;
}
