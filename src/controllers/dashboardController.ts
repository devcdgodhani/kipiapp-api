import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, STORE_SUCCESS_MESSAGES } from '../constants';
import { DashboardService } from '../services';
import { TIncomeExpenseRes } from '../types';

export default class DashboardController {
  dashboardService = new DashboardService();

  constructor() {}

  /*********** Fetch Income Expense Report***********/
  incomeExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const incomeExpenseList = await this.dashboardService.getIncomeExpenseTransactionListByDate(
        req.body
      );

      const response: TIncomeExpenseRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: incomeExpenseList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };
}
