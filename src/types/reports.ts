import { REPORT_INTERVAL } from '../constants';
import { IApiResponse } from '../interfaces';

export type TReportsReq = {
  startDate: Date;
  endDate: Date;
  type: string;
  interval: REPORT_INTERVAL;
};

export type TIncomeExpenseList = {
  date: Date;
  data: {
    income: number;
    expense: number;
  };
};

export type TIncomeExpenseRes = IApiResponse<TIncomeExpenseList[]>;
