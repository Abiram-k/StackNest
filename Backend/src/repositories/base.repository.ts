import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { IBaseRepository } from "../interfaces/repositories/base.repository.interface.js";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const created = await this.model.create(data);
    return created;
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<void> {
    await this.model.updateOne({ _id: id } as FilterQuery<T>, update).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id } as FilterQuery<T>).exec();
  }
}
