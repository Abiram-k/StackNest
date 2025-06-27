import { NextFunction, Request, Response } from "express";
import { IUserConnectionController } from "../../interfaces/controllers/user.connection.controller.interface";
import { IConnectionService } from "../../interfaces/services/connection.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";

export class UserConnectionController implements IUserConnectionController {
  private _connectionService: IConnectionService;
  constructor(connectionService: IConnectionService) {
    this._connectionService = connectionService;
  }

  async sendConnectionRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { recieverUserName } = req.body;
      const { userId } = req.user as { userId: string; role: string };
      await this._connectionService.sendConnectionRequest(
        userId,
        recieverUserName
      );
      res.status(HttpStatus.OK).json({
        message: "Request sended",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConnectionRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string; role: string };
      const requests = await this._connectionService.getConnectionRequests(
        userId
      );
      res.status(HttpStatus.OK).json({
        message: "fetched sended requests",
        success: true,
        requests,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string; role: string };
      const { notifications } = await this._connectionService.getNotifications(
        userId
      );
      res.status(HttpStatus.OK).json({
        message: "fetched sended requests",
        success: true,
        notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { requestId } = req.body;
      await this._connectionService.acceptRequest(requestId);
      res.status(HttpStatus.OK).json({
        message: "Connection request accepted",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  async rejectRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { requestId } = req.body;
      await this._connectionService.rejectRequest(requestId);
      res.status(HttpStatus.OK).json({
        message: "Connection request rejected",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async unfollow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { freindUserName } = req.body;
      const { userId } = req.user as { userId: string; role: string };
      await this._connectionService.unfollow(userId, freindUserName);
      res.status(HttpStatus.OK).json({
        message: "unfollowed successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllConnections(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string; role: string };
      const search = String(req.query.search) || "";

      const { friends } = await this._connectionService.getAllConnections(
        userId,
        search
      );
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched all freinds",
        success: true,
        friends,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string; role: string };
      const friendId = String(req.query.friendId) || "";
      const data = await this._connectionService.getMessages(userId, friendId);
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched messages",
        success: true,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  }
  async toggleIsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { messageId } = req.params;
      await this._connectionService.toggleIsRead(messageId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Marked as readed", success: true });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadMessageCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string; role: string };
      const count = await this._connectionService.getUnreadMessageCount(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Fetched unread count", success: true, count });
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { messageId } = req.params;
      const recieverId = await this._connectionService.deleteMessage(messageId);
      res.status(HttpStatus.OK).json({
        message: "Message deleted",
        success: true,
        deletedMessageId: messageId,
        friendId: recieverId,
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchCallLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user as { userId: string; role: string };
      const callLogs = await this._connectionService.fetchCallLogs(userId);
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched call logs",
        success: true,
        callLogs,
      });
    } catch (error) {
      next(error);
    }
  }
}
