export interface IChallengeRespository<T> {
  findById(challengeId: string): Promise<T | null>;
  fetchAllChallenge(
    currentPage?: number,
    limit?: number
  ): Promise<{ challenges: T[]; totalPages: number }>;
  addNewChallenge(data: Partial<T>): Promise<boolean>;
  updateChallenge(challengeId: string, data: Partial<T>): Promise<boolean>;
  removeChallenge(challengeId: string): Promise<void>;
  toggleListing(challengeId: string): Promise<void>;
  unListAllChallenge(): Promise<void>;
  scheduleChallenge(challengeId: string): Promise<void>;
}
