import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../helpers';
import { REPORT_INTERVAL, TRANSACTION_REFERENCE_MODULE } from '../constants';
import Joi from 'joi';

export default class ReportsValidator {
  incomeExpense = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = {
        startDate: Joi.date().optional(),
        // .default(subDays(new Date(), 7)),
        endDate: Joi.date().optional(),
        // .default(endOfToday()),

        type: Joi.string()
          .trim()
          .valid(...Object.values(TRANSACTION_REFERENCE_MODULE))
          .optional(),

        interval: Joi.string()
          .valid(...Object.values(REPORT_INTERVAL))
          .optional()
          .default(REPORT_INTERVAL.DAILY),
      };
      req.body = validateSchema(schema, { ...req.query, ...req.body, ...req.params });
      next();
    } catch (err) {
      next(err);
    }
  };
}
