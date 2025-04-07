export interface IRewardRepository<T> {
  getAllRewards(): Promise<T[]>;
  getRewardById(rewardId: string): Promise<T | null>;
  getActiveRewards(): Promise<T[]>;
  createReward(data: Partial<T>): Promise<void>;
  findByIdAndUpdate(rewardId: string, data: Partial<T>): Promise<void>;
  toggleList(rewardId: string): Promise<void>;
  findByIdAndRemove(rewardId: string): Promise<void>;
}
