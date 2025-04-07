export interface PremiumResDto {
  _id: string;
  title: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  periodInDays:number;
  isExpired:boolean;
  benefits: string[];
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
