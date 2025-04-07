export interface RewardResDto {
  _id: string;
  name: string;
  description: string;
  points_cost: number;
  benefit_key: string;
  type:string;
  isActive:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
