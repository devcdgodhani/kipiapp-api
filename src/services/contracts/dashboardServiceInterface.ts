import { TDashboardReq, TIncomeExpenseChartList, TOrderStatsChartList } from '../../types';

export interface IDashboardService {
  getIncomeExpenseTransactionListByDate: (
    reqData: TDashboardReq
  ) => Promise<TIncomeExpenseChartList[]>;
  getOrderStatsChartByDate: (reqData: TDashboardReq) => Promise<TOrderStatsChartList[]>;
}
