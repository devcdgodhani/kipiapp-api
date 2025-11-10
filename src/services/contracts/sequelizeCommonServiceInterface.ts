/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FindOptions,
  WhereOptions,
  UpdateOptions,
  BulkCreateOptions,
  DestroyOptions,
  CreateOptions,
  Identifier,
  UpsertOptions,
  CountOptions,
  Model,
  Transaction,
} from 'sequelize';

import { IPaginationData } from '../../interfaces';

export interface IReadService<T extends Model> {
  generateFilter(options: {
    filters?: Record<string, any>;
    searchFields?: (keyof T['_attributes'])[];
  }): { filter: WhereOptions; options: FindOptions };

  findByPk(
    identifier: Identifier,
    options?: FindOptions<T['_attributes']>
  ): Promise<T['_attributes'] | null>;

  findAll(
    where: WhereOptions<T['_attributes']>,
    options?: FindOptions<T['_attributes']>
  ): Promise<T['_attributes'][]>;

  findOne(
    where: WhereOptions<T['_attributes']>,
    options?: FindOptions<T['_attributes']>
  ): Promise<T['_attributes'] | null>;

  findAllWithPagination(
    where: WhereOptions<T['_attributes']>,
    options?: FindOptions<T['_attributes']> & { page?: number; limit?: number }
  ): Promise<IPaginationData<T['_attributes']>>;

  count(
    where: WhereOptions<T['_attributes']>,
    options?: CountOptions<T['_attributes']>
  ): Promise<number>;
}

export interface IWriteService<T extends Model> {
  create(
    createData: T['_creationAttributes'],
    options?: CreateOptions<T['_attributes']> & { transaction?: Transaction }
  ): Promise<T['_attributes']>;

  bulkCreate(
    createData: T['_creationAttributes'][],
    options?: BulkCreateOptions<T['_attributes']>
  ): Promise<T['_attributes'][]>;

  update(
    where: WhereOptions<T['_attributes']>,
    updateData: Partial<T['_attributes']>,
    options?: Omit<UpdateOptions<T['_attributes']>, 'where'>
  ): Promise<[number]>;

  upsert(
    conflictWhere: WhereOptions<T['_attributes']>,
    updateData: T['_creationAttributes'],
    options?: Partial<UpsertOptions<T['_attributes']>>
  ): Promise<[T['_attributes'], boolean | null]>;
}

export interface IDeleteService<T extends Model> {
  softDelete(
    where: WhereOptions<T['_attributes']>,
    options?: DestroyOptions<T['_attributes']>
  ): Promise<number>;

  delete(
    where: WhereOptions<T['_attributes']>,
    options?: DestroyOptions<T['_attributes']>
  ): Promise<number>;
}

export interface ISequelizeCommonService<T extends Model>
  extends IReadService<T>,
    IWriteService<T>,
    IDeleteService<T> {}
