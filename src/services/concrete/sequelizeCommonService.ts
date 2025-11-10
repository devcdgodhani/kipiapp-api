/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FindOptions,
  WhereOptions,
  Model,
  ModelStatic,
  UpdateOptions,
  BulkCreateOptions,
  DestroyOptions,
  CreateOptions,
  Identifier,
  UpsertOptions,
  CountOptions,
  Op,
  Transaction,
} from 'sequelize';

import { IPaginationData } from '../../interfaces';
import { ISequelizeCommonService } from '../contracts/sequelizeCommonServiceInterface';

export class SequelizeCommonService<T extends Model> implements ISequelizeCommonService<T> {
  private model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /* -------------------------------------------------------------------------- */
  /*                             🔍 Generate Filters                            */
  /* -------------------------------------------------------------------------- */
  generateFilter = (options: {
    filters?: Record<string, any>;
    searchFields?: (keyof T['_attributes'])[];
  }): { filter: WhereOptions; options: FindOptions } => {
    const { filters = {}, searchFields = [] } = options;
    const filterOptions: FindOptions = {};

    // We'll build a flexible object first
    const rawWhere: any = {};

    //  Search keyword
    if (filters.search && searchFields.length > 0) {
      const search = filters.search;
      rawWhere[Op.or] = searchFields.map((field) => ({
        [field]: { [Op.iLike]: `%${search}%` },
      }));
      delete filters.search;
    }

    // Other filters
    for (const [field, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') continue;

      if (Array.isArray(value)) {
        rawWhere[field] = { [Op.in]: value };
      } else if (typeof value === 'object') {
        const range: any = {};
        if (value.from !== undefined) range[Op.gte] = value.from;
        if (value.to !== undefined) range[Op.lte] = value.to;
        if (value.gt !== undefined) range[Op.gt] = value.gt;
        if (value.lt !== undefined) range[Op.lt] = value.lt;
        rawWhere[field] = range;
      } else {
        rawWhere[field] = typeof value === 'string' ? { [Op.iLike]: `%${value}%` } : value;
      }
    }

    if (filters.isPaginate) {
      filterOptions.limit = filters.limit as number;
      filterOptions.page = filters.page;
      filterOptions.order = filters.order;
    }

    delete rawWhere.limit;
    delete rawWhere.page;
    delete rawWhere.order;
    delete rawWhere.search;
    delete rawWhere.isPaginate;

    return { filter: rawWhere, options: filterOptions };
  };

  /* -------------------------------------------------------------------------- */
  /*                                   READ                                     */
  /* -------------------------------------------------------------------------- */

  findByPk = async (
    identifier: Identifier,
    options?: FindOptions<T['_attributes']>
  ): Promise<T['_attributes'] | null> => {
    try {
      return this.model.findByPk(identifier, options);
    } catch (err) {
      throw err;
    }
  };

  findAll = async (
    where: WhereOptions<T['_attributes']> = {},
    options?: FindOptions<T['_attributes']>
  ): Promise<T['_attributes'][]> => {
    try {
      const finalOptions: FindOptions<T['_attributes']> = {
        ...options,
        where,
        order: options?.order || [['updatedAt', 'DESC']],
      };
      return this.model.findAll(finalOptions);
    } catch (err) {
      throw err;
    }
  };

  findOne = async (
    where: WhereOptions<T['_attributes']>,
    options?: FindOptions<T['_attributes']>
  ): Promise<T['_attributes'] | null> => {
    try {
      return this.model.findOne({ where, ...options });
    } catch (err) {
      throw err;
    }
  };

  findAllWithPagination = async (
    where: WhereOptions<T['_attributes']> = {},
    options?: FindOptions<T['_attributes']> & { page?: number; limit?: number }
  ): Promise<IPaginationData<T['_attributes']>> => {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;
      delete options?.page;

      const totalRecords = await this.model.count({ where, include: options?.include });
      const totalPages = Math.ceil(totalRecords / limit);

      const listOfRecords = await this.model.findAll({
        where,
        ...options,
        order: options?.order || [['updatedAt', 'DESC']],
        limit,
        offset,
      });

      return {
        limit,
        totalRecords,
        totalPages,
        hasPreviousPage: page > 1,
        currentPage: page > totalPages ? totalPages : page,
        hasNextPage: page < totalPages,
        recordList: listOfRecords,
      };
    } catch (err) {
      throw err;
    }
  };

  count = async (
    where: WhereOptions<T['_attributes']>,
    options?: CountOptions<T['_attributes']>
  ): Promise<number> => {
    try {
      return this.model.count({ where, ...options });
    } catch (err) {
      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   WRITE                                    */
  /* -------------------------------------------------------------------------- */

  create = async (
    createData: T['_creationAttributes'],
    options?: CreateOptions<T['_attributes']> & { transaction?: Transaction }
  ): Promise<T['_attributes']> => {
    try {
      return this.model.create(createData, options);
    } catch (err) {
      throw err;
    }
  };

  bulkCreate = async (
    createData: T['_creationAttributes'][],
    options?: BulkCreateOptions<T['_attributes']>
  ): Promise<T['_attributes'][]> => {
    try {
      return this.model.bulkCreate(createData, options);
    } catch (err) {
      throw err;
    }
  };

  update = async (
    where: WhereOptions<T['_attributes']>,
    updateData: Partial<T['_attributes']>,
    options?: Omit<UpdateOptions<T['_attributes']>, 'where'>
  ): Promise<[number]> => {
    try {
      return this.model.update(updateData, { where, ...options });
    } catch (err) {
      throw err;
    }
  };

  upsert = async (
    conflictWhere: WhereOptions<T['_attributes']>,
    updateData: T['_creationAttributes'],
    options?: Partial<UpsertOptions<T['_attributes']>>
  ): Promise<[T['_attributes'], boolean | null]> => {
    try {
      return this.model.upsert(updateData, { conflictWhere, ...options });
    } catch (err) {
      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   DELETE                                   */
  /* -------------------------------------------------------------------------- */

  softDelete = async (
    where: WhereOptions<T['_attributes']>,
    options?: DestroyOptions<T['_attributes']>
  ): Promise<number> => {
    try {
      return this.model.destroy({ where, ...options });
    } catch (err) {
      throw err;
    }
  };

  delete = async (
    where: WhereOptions<T['_attributes']>,
    options?: DestroyOptions<T['_attributes']>
  ): Promise<number> => {
    try {
      return this.model.destroy({ where, ...options });
    } catch (err) {
      throw err;
    }
  };
}
