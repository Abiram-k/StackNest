import { ROOM_ROUTES } from "@/constants/apiRoutes";
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
    totalDuration: number;
    lastJoined: Date;
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
  session: RoomSessionType[];
  totalPages: number;
};

export class RoomService {
  private httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async createRoom(data: RoomSchema) {
    return await this.httpService.post(ROOM_ROUTES.CREATE_ROOM, data);
  }
  async updateRoom(id: string, data: RoomSchema) {
    return await this.httpService.put(ROOM_ROUTES.UPDATE_ROOM(id), data);
  }
  async fetchMyrooms(): Promise<roomResponse> {
    return await this.httpService.get(ROOM_ROUTES.MY_ROOMS);
  }
  async fetchAvailableRooms(
    role: string,
    filters: string
  ): Promise<availableRoomResponse> {
    return await this.httpService.get(
      ROOM_ROUTES.AVAILABLE_ROOMS(role, filters)
    );
  }

  async fetchSelectedRoom(
    role: string,
    id: string
  ): Promise<fetchSelectRoomResponse> {
    return await this.httpService.get(ROOM_ROUTES.SELECTED_ROOM(role, id));
  }

  async removeRoom(id: string): Promise<axiosResponse> {
    return await this.httpService.delete(ROOM_ROUTES.DELETE_ROOM(id));
  }

  async blockRoom(id: string): Promise<axiosResponse> {
    return await this.httpService.patch(ROOM_ROUTES.BLOCK_ROOM(id));
  }

  async joinRoom(data: {
    roomId: string;
  }): Promise<axiosResponse & { roomId: string; role: string }> {
    return await this.httpService.post(ROOM_ROUTES.JOIN_ROOM, data);
  }

  async verifyPassword(
    roomId: string,
    password: string
  ): Promise<axiosResponse> {
    return await this.httpService.post(ROOM_ROUTES.VERIFY_PASSWORD(roomId), {
      password,
    });
  }

  async fetchRoomSession(
    roomId: string,
    role: string,
    filters: string
  ): Promise<fetchRoomSessoinRespons> {
    return await this.httpService.get(
      ROOM_ROUTES.FETCH_ROOM_SESSION(roomId, role, filters)
    );
  }
}
