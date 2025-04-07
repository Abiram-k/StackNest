export interface IPremium {
  _id: string;
  title: string;
  description: string;
  periodInDays: number;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
}
