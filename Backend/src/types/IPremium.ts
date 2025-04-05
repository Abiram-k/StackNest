export interface IPremium {
  _id: string;
  title: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
