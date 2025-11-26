import { TReportsReq, TIncomeExpenseList } from '../../types';

export interface IReportsService {
  getIncomeExpenseTransactionListByDate: (reqData: TReportsReq) => Promise<TIncomeExpenseList[]>;
}
