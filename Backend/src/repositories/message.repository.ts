import { IMessageRepository } from "../interfaces/repositories/message.repository.interface";
import { Message } from "../models/message.model";
import { IMessage } from "../types/IMessage";
import { BaseRepository } from "./base.repository";

export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository<IMessage>
{
  constructor() {
    super(Message);
  }
  async createMessage(
    sender: string,
    receiver: string,
    content: string,
    type: string
  ): Promise<IMessage> {
    try {
      const newMessage = await Message.create({
        content,
        receiver,
        sender,
        type,
      });
      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  async getMessages(user1: string, user2: string): Promise<IMessage[]> {
    try {
      return await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      }).sort({ createdAt: 1 });
    } catch (error) {
      throw error;
    }
  }

  async getUnreadMessagesCount(user1: string, user2: string): Promise<number> {
    try {
      const unReadMsgs = await this.findAll({
        sender: user2,
        receiver: user1,
        isRead: false,
      });
      // const unReadMsgs = await Message.find({
      //   sender: user2,
      //   receiver: user1,
      //   isRead: false,
      // });
      return unReadMsgs.length;
    } catch (error) {
      throw error;
    }
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const messages = await Message.find({
        receiver: userId,
        isRead: false,
        sender: { $ne: userId },
      });
      return messages.length;
    } catch (error) {
      throw error;
    }
  }

  async findByAndDelete(messageId: string): Promise<string | null> {
    try {
      const deletedMessage = await Message.findByIdAndDelete(messageId);
      return deletedMessage ? deletedMessage.receiver.toString() : null;
    } catch (error) {
      throw error;
    }
  }

  async toggleIsRead(messageId: string): Promise<void> {
    try {
      await Message.findByIdAndUpdate(messageId, { isRead: true });
    } catch (error) {
      throw error;
    }
  }

  async addReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<void> {
    try {
      await Message.findByIdAndUpdate(messageId, {
        $push: { reactions: { userId, emoji } },
      });
    } catch (error) {
      throw error;
    }
  }
  async removeReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<void> {
    try {
      await Message.findByIdAndUpdate(messageId, {
        $pull: { reactions: { userId, emoji } },
      });
    } catch (error) {
      throw error;
    }
  }
}
