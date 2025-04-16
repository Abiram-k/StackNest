export interface IMessageRepository<T> {
  createMessage(
    sender: string,
    receiver: string,
    content: string,
    type: string
  ): Promise<T>;
  getMessages(user1: string, user2: string): Promise<T[]>;
  getUnreadMessagesCount(user1: string, user2: string): Promise<number>;
  toggleIsRead(messageId: string): Promise<void>;
  getUnreadMessageCount(userId: string): Promise<number>;
}
