import { REPORT_INTERVAL } from '../constants';
import { IApiResponse } from '../interfaces';

export type TDashboardReq = {
  startDate: Date;
  endDate: Date;
  type: string;
  interval: REPORT_INTERVAL;
};

export type TIncomeExpenseChartList = {
  date: Date;
  data: {
    income: number;
    expense: number;
  };
};

export type TIncomeExpenseRes = IApiResponse<TIncomeExpenseChartList[]>;
