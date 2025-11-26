import { REPORT_INTERVAL } from '../constants';
import { IApiResponse } from '../interfaces';

export type TDashboardReq = {
  startDate: Date;
  endDate: Date;
  type: string | string[];
  interval: REPORT_INTERVAL;
};

export type TIncomeExpenseChartList = {
  label: Date;
  data: {
    income: number;
    expense: number;
  };
};

export type TOrderStatsChartList = {
  label: Date;
  data: {
    [key: string]: { count: number; amount: number };
  };
};

export type TIncomeExpenseRes = IApiResponse<TIncomeExpenseChartList[]>;

export type TOrderStatsChartRes = IApiResponse<TOrderStatsChartList[]>;
