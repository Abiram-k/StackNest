import { HttpService } from "../httpService";
import { axiosResponse, RoomSchema, RoomSessionType } from "@/types";

type host = {
  userName: string;
  avatar: string;
  gender: string;
  email: string;
  lastLogin: string;
  isVerified: boolean;
};

export interface IRoom extends Document {
  _id: string;
  roomId: string;
  title: string;
  description: string;
  host: host;
  isBlocked: boolean;
  startedAt: Date;
  participants: {
    user: { userName: string; avatar: string };
    totalDuration:number,
   lastJoined:Date,

  }[];
  isPrivate: string;
  isPremium: string;
  password?: string;
  scheduledAt?: Date;
  roomType: "normal" | "general";
  status: "online" | "offline" | "scheduled";
  endedAt: Date;
  limit: number;
  createdAt: Date;
}
type roomResponse = axiosResponse & {
  rooms: IRoom[];
};
type availableRoomResponse = axiosResponse & {
  rooms: IRoom[];
  totalPages: number;
};

type fetchSelectRoomResponse = axiosResponse & {
  room: IRoom;
};

type fetchRoomSessoinRespons = axiosResponse & {
  session:RoomSessionType[]
  totalPages: number,
}

export class RoomService {
  private httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async createRoom(data: RoomSchema) {
    return await this.httpService.post("users/room", data);
  }
  async updateRoom(id: string, data: RoomSchema) {
    return await this.httpService.put(`users/room?id=${id}`, data);
  }
  async fetchMyrooms(): Promise<roomResponse> {
    return await this.httpService.get("users/room/my-rooms");
  }
  async fetchAvailableRooms(
    role: string,
    filters: string
  ): Promise<availableRoomResponse> {
    return await this.httpService.get(`${role}/room/available-rooms${filters}`);
  }

  async fetchSelectedRoom(
    role: string,
    id: string
  ): Promise<fetchSelectRoomResponse> {
    return await this.httpService.get(`${role}/room/${id}`);
  }

  async removeRoom(id: string): Promise<axiosResponse> {
    return await this.httpService.delete(`users/room/${id}`);
  }

  async blockRoom(id: string): Promise<axiosResponse> {
    return await this.httpService.patch(`admin/room/${id}`);
  }

  async joinRoom(data: { roomId: string }): Promise<axiosResponse & {roomId:string,role:string}> {
    return await this.httpService.post("/users/room/join", data);
  }

  async verifyPassword(
    roomId: string,
    password: string
  ): Promise<axiosResponse> {
    return await this.httpService.post(`users/room/verify-password/${roomId}`, {
      password,
    });
  }

  async fetchRoomSession( roomId:string, role: string,
    filters: string):Promise<fetchRoomSessoinRespons>{
      return await this.httpService.get(`${role}/room/${roomId}/session${filters}`);
    }
}
