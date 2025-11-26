import { TReportsReq, TIncomeExpenseChartList } from '../../types';

export interface IReportsService {
  getIncomeExpenseTransactionListByDate: (reqData: TReportsReq) => Promise<TIncomeExpenseChartList[]>;
}
