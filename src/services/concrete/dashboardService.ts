/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, PipelineStage } from 'mongoose';
import { TIncomeExpenseChartList, TDashboardReq } from '../../types';
import { IDashboardService } from '../contracts';
import { TransactionService } from './transactionService';
import { ITransactionAttributes } from '../../interfaces';
import { MONTH_NAMES, REPORT_INTERVAL, TRANSACTION_ACTION } from '../../constants';
import { generateEmptyDateBuckets } from '../../helpers';

export class DashboardService implements IDashboardService {
  transactionService = new TransactionService();

  constructor() {}

  getIncomeExpenseTransactionListByDate = async (
    reqData: TDashboardReq
  ): Promise<TIncomeExpenseChartList[]> => {
    const filter: FilterQuery<ITransactionAttributes> = {};
    if (reqData.startDate) filter.date = { $gte: reqData.startDate };

    if (reqData.endDate) filter.date['$lte'] = reqData.endDate;

    if (reqData.type) filter.referenceModule = reqData.type;

    let groupId: any = {};
    let labelProject: any = {};

    switch (reqData.interval || REPORT_INTERVAL.DAILY) {
      case REPORT_INTERVAL.DAILY:
        groupId = {
          $dateToString: { format: '%d-%m-%Y', date: '$date' },
        };
        labelProject = '$_id';
        break;

      case REPORT_INTERVAL.MONTHLY:
        groupId = {
          year: { $year: '$date' },
          month: { $month: '$date' },
        };
        labelProject = {
          $concat: [
            {
              $arrayElemAt: [MONTH_NAMES, '$_id.month'],
            },
            ' ',
            { $toString: '$_id.year' },
          ],
        };
        break;

      case REPORT_INTERVAL.YEARLY:
        groupId = { $year: '$date' };
        labelProject = { $toString: '$_id' };
        break;
    }

    const aggregateQuery: PipelineStage[] = [
      {
        $match: filter,
      },
      {
        $group: {
          _id: groupId,
          income: {
            $sum: {
              $cond: [{ $eq: ['$action', TRANSACTION_ACTION.CREDIT] }, '$amount', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$action', TRANSACTION_ACTION.DEBIT] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          label: labelProject,
          data: {
            income: '$income',
            expense: '$expense',
          },
        },
      },
      { $sort: { label: 1 } },
    ];
    let transactionList = await this.transactionService.aggregate(aggregateQuery);

    const buckets = generateEmptyDateBuckets(reqData.startDate, reqData.endDate, reqData.interval, {
      income: 0,
      expense: 0,
    });

    transactionList = buckets.map((b) => {
      const found = transactionList.find((r: any) => r.label === b.label);
      return found || b;
    });

    return transactionList as never;
  };
}
