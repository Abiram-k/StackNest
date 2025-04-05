export interface IBenefit {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
