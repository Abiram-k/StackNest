import { IMessageRepository } from "../interfaces/repositories/message.repository.interface";
import { Message } from "../models/message.model";
import { IMessage } from "../types/IMessage";

export class MessageRepository implements IMessageRepository<IMessage> {
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
      const unReadMsgs = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
        isRead: false,
      });
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

  async toggleIsRead(messageId: string): Promise<void> {
    try {
      await Message.findByIdAndUpdate(messageId, { isRead: true });
    } catch (error) {
      throw error;
    }
  }
}
