import { IRoom } from "./IRoom";

export interface IFavorites {
  user: string;
  roomId: string | IRoom;
}
