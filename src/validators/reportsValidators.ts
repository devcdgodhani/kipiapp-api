import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../helpers';
import { REPORT_INTERVAL, TRANSACTION_REFERENCE_MODULE } from '../constants';
import Joi from 'joi';
import { startOfYear, subDays, endOfToday } from 'date-fns';

export default class ReportsValidator {
  incomeExpense = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = {
        interval: Joi.string()
          .valid(...Object.values(REPORT_INTERVAL))
          .default(REPORT_INTERVAL.DAILY),

        type: Joi.string()
          .trim()
          .valid(...Object.values(TRANSACTION_REFERENCE_MODULE))
          .optional(),

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startDate: Joi.date().default((parent: any) => {
          const today = new Date();

          if (
            parent.interval === REPORT_INTERVAL.MONTHLY ||
            parent.interval === REPORT_INTERVAL.YEARLY
          ) {
            return startOfYear(today);
          }

          // DAILY (default)
          return subDays(today, 7);
        }),

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        endDate: Joi.date().default(endOfToday()),
      };
      req.body = validateSchema(schema, { ...req.query, ...req.body, ...req.params });
      next();
    } catch (err) {
      next(err);
    }
  };
}
