import { Document, FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;

  findOne(filter: FilterQuery<T>): Promise<T | null>;

  findAll(filter?: FilterQuery<T>): Promise<T[]>;

  create(data: Partial<T>): Promise<T>;

  updateById(id: string, update: UpdateQuery<T>): Promise<void>;

  deleteById(id: string): Promise<void>;
}
