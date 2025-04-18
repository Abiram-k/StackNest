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
  findByAndDelete(messageId: string): Promise<string | null>;
  removeReaction(messageId:string, emoji:string, userId:string):Promise<void>
  addReaction(messageId:string, emoji:string, userId:string):Promise<void>
}
