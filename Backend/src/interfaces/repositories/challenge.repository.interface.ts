export interface IChallengeRespository<T> {
  fetchAllChallenge(): Promise<T[] | null>;
  addNewChallenge(data: Partial<T>): Promise<boolean>;
  updateChallenge(
    challengeId: string,
    data: Partial<T>
  ): Promise<boolean>;
}
