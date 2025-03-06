import { RoomSchema } from "../../../../types/user";
import { HttpService } from "../httpService";
import { axiosResponse } from "../../../../types/user";

export interface IRoom extends Document {
  roomId: string;
  title: string;
  description: string;
  host: string;
  isBlocked: boolean;
  startedAt: Date;
  participants: { name: string; avatar: string }[];
  isPrivate: string;
  isPremium: string;
  password?: string;
  scheduledAt?: Date;
  status: "online" | "offline" | "scheduled";
  endedAt: Date;
  limit: number;
  createdAt: Date;
}
type roomResponse = axiosResponse & {
  myRooms:IRoom[]
}

export class RoomService {
  private httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async createRoom(data: RoomSchema) {
    console.log(data, "From Room service ... ");
    return this.httpService.post("users/room", data);
  }
  async updateRoom(id: string, data: RoomSchema) {
    return this.httpService.post(`users/room?id=${id}`, data);
  }
  async fetchMyrooms(): Promise<roomResponse> {
    return this.httpService.get("users/rooms/my-rooms");
  }
  async fetchAvableRooms(filters: string) {
    return this.httpService.get(`users/rooms/available-rooms${filters}`);
  }
}
