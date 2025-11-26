import { TDashboardReq, TIncomeExpenseChartList } from '../../types';

export interface IDashboardService {
  getIncomeExpenseTransactionListByDate: (reqData: TDashboardReq) => Promise<TIncomeExpenseChartList[]>;
}
