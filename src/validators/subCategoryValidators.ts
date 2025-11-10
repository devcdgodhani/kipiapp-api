import { Request, Response, NextFunction } from 'express';
import { ISubCategoryAttributes } from '../interfaces';
import { SubCategoryModel } from '../db/postgreSql';
import { sequelizeToJoi, validateSchema } from '../helpers';

export default class SubCategoryValidator {
  private filterSchema = sequelizeToJoi<ISubCategoryAttributes>({
    schema: SubCategoryModel,
    isFilterSchema: true,
  });

  private createSchema = sequelizeToJoi<ISubCategoryAttributes>({
    schema: SubCategoryModel,
    includeFields: ['title', 'categoryId', 'description', 'storeId'],
    requiredFields: ['title', 'categoryId', 'storeId'],
  });

  private updateSchema = sequelizeToJoi<ISubCategoryAttributes>({
    schema: SubCategoryModel,
    // excludeFields: ['title', 'status'],
  });

  getOne = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = { ...this.filterSchema };
      req.body = validateSchema(schema, { ...req.query, ...req.body, ...req.params });
      next();
    } catch (err) {
      next(err);
    }
  };

  getAll = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = { ...this.filterSchema };
      req.body = validateSchema(schema, { ...req.query, ...req.body, ...req.params });
      next();
    } catch (err) {
      next(err);
    }
  };

  getWithPagination = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = { ...this.filterSchema };
      req.body = validateSchema(schema, {
        ...req.query,
        ...req.body,
        ...req.params,
        isPaginate: true,
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = validateSchema(this.createSchema, req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

  bulkCreate = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.body)) throw new Error('Body must be an array');
      req.body = req.body.map((item) => validateSchema(this.createSchema, item));
      next();
    } catch (err) {
      next(err);
    }
  };

  // ---------- Update Validators ---------- //

  updateByFilter = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filter, update } = req.body;
      validateSchema({ ...this.filterSchema }, filter);
      validateSchema({ ...this.updateSchema }, update);
      next();
    } catch (err) {
      next(err);
    }
  };

  updateManyByFilter = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.body)) throw new Error('Body must be an array');
      req.body = req.body.map((item) => {
        const { filter, update } = item;
        validateSchema({ ...this.filterSchema }, filter);
        validateSchema({ ...this.updateSchema }, update);
      });

      next();
    } catch (err) {
      next(err);
    }
  };

  // ---------- Delete Validators ---------- //

  deleteByFilter = (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = validateSchema({ ...this.filterSchema }, req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
