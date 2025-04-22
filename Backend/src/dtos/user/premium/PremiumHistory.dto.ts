interface PremiumDTO {
  _id:string,
  benefits: string[];
  discountAmount: number;
  regularAmount: number;
  description: string;
  title: string;
}

export interface PremiumHistoryDTO {
  status: "active" | "expired" | "pending";
  startingDate: string;
  endingDate: string;
  plan: PremiumDTO;
};
