import { Request, Response, NextFunction } from 'express';
import { IContactAddressAttributes } from '../interfaces';
import { ContactAddressSchema } from '../db/mongodb';
import { mongooseToJoi, validateSchema } from '../helpers';

export default class ContactAddressValidator {
  private filterSchema = mongooseToJoi<IContactAddressAttributes>({
    schema: ContactAddressSchema,
    isFilterSchema: true,
  });

  private createSchema = mongooseToJoi<IContactAddressAttributes>({
    schema: ContactAddressSchema,
    includeFields: ['title', 'userId'],
    requiredFields: ['title', 'userId'],
  });

  private updateSchema = mongooseToJoi<IContactAddressAttributes>({
    schema: ContactAddressSchema,
    // excludeFields: ['title'],
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
