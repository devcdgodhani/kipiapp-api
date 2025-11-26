import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../helpers';
import { ORDER_TYPE, REPORT_INTERVAL, TRANSACTION_REFERENCE_MODULE } from '../constants';
import Joi from 'joi';
import { startOfYear, subDays, endOfToday } from 'date-fns';

export default class DashboardValidator {
  validType = [...Object.values(TRANSACTION_REFERENCE_MODULE), ...Object.values(ORDER_TYPE)];
  chartBaseFilter = {
    interval: Joi.string()
      .valid(...Object.values(REPORT_INTERVAL))
      .default(REPORT_INTERVAL.DAILY),

    type: Joi.alternatives()
      .try(
        Joi.string()
          .trim()
          .valid(...this.validType),
        Joi.array().items(
          Joi.string()
            .trim()
            .valid(...this.validType)
        )
      )
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
  incomeExpenseChart = (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = validateSchema(
        { ...this.chartBaseFilter },
        { ...req.query, ...req.body, ...req.params }
      );
      next();
    } catch (err) {
      next(err);
    }
  };
  orderStatsChart = (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = validateSchema(
        { ...this.chartBaseFilter },
        { ...req.query, ...req.body, ...req.params }
      );
      next();
    } catch (err) {
      next(err);
    }
  };
}
