export interface IPremiumHistory {
  status: "active" | "expired" | "pending";
  startingDate: Date;
  endingDate: Date;
  premiumPlan: string;
  createdAt?: Date;
  updatedAt?: Date;
}