/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, PipelineStage } from 'mongoose';
import { TIncomeExpenseChartList, TDashboardReq, TOrderStatsChartList } from '../../types';
import { IDashboardService } from '../contracts';
import { TransactionService } from './transactionService';
import { IOrderAttributes, ITransactionAttributes } from '../../interfaces';
import { ORDER_STATUS, TRANSACTION_ACTION } from '../../constants';
import {
  generateEmptyDateBuckets,
  getGroupIdAndLabelByDateForChart,
  normalizeToArray,
} from '../../helpers';
import { OrderService } from './orderService';

export class DashboardService implements IDashboardService {
  transactionService = new TransactionService();
  orderService = new OrderService();

  constructor() {}

  getIncomeExpenseTransactionListByDate = async (
    reqData: TDashboardReq
  ): Promise<TIncomeExpenseChartList[]> => {
    const filter: FilterQuery<ITransactionAttributes> = {};
    if (reqData.startDate) filter.date = { $gte: reqData.startDate };

    if (reqData.endDate) filter.date['$lte'] = reqData.endDate;

    if (reqData.type) filter.referenceModule = { $in: normalizeToArray(reqData.type) };

    const { groupId, label } = getGroupIdAndLabelByDateForChart('date', reqData.interval);

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
          label,
          data: {
            income: '$income',
            expense: '$expense',
          },
        },
      },
      { $sort: { label: 1 } },
    ];
    let transactionList = await this.transactionService.aggregate(aggregateQuery);

    const bucketList = generateEmptyDateBuckets(
      reqData.startDate,
      reqData.endDate,
      reqData.interval,
      {
        income: 0,
        expense: 0,
      }
    );

    transactionList = bucketList.map((b) => {
      const found = transactionList.find((r: any) => r.label === b.label);
      return found || b;
    });

    return transactionList as never;
  };

  getOrderStatsChartByDate = async (reqData: TDashboardReq): Promise<TOrderStatsChartList[]> => {
    const filter: FilterQuery<IOrderAttributes> = {
      status: ORDER_STATUS.PLACED,
    };
    if (reqData.startDate) filter.createdAt = { $gte: reqData.startDate };

    if (reqData.endDate) filter.createdAt['$lte'] = reqData.endDate;

    if (reqData.type) filter.type = { $in: normalizeToArray(reqData.type) };

    const { groupId, label } = getGroupIdAndLabelByDateForChart('createdAt', reqData.interval);

    const aggregateQuery: PipelineStage[] = [
      { $match: filter },
      {
        $group: {
          _id: {
            label: groupId,
            type: '$type',
          },
          count: { $sum: 1 },
          amount: { $sum: '$paidAmount' },
        },
      },
      {
        $group: {
          _id: '$_id.label',
          types: {
            $push: {
              type: '$_id.type',
              count: '$count',
              amount: '$amount',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          label: label,
          data: {
            $arrayToObject: {
              $map: {
                input: '$types',
                as: 't',
                in: {
                  k: '$$t.type',
                  v: { count: '$$t.count', amount: '$$t.amount' },
                },
              },
            },
          },
        },
      },
      { $sort: { label: 1 } },
    ];
    let transactionList = await this.orderService.aggregate(aggregateQuery);

    const bucketList = generateEmptyDateBuckets(
      reqData.startDate,
      reqData.endDate,
      reqData.interval,
      {}
    );

    transactionList = bucketList.map((b) => {
      let found: any = transactionList.find((r: any) => r.label === b.label);
      if (!found) found = b;
      (reqData.type as string[]).forEach((type) => {
        if (found && !found.data[type])
          found['data'] = {
            ...(found['data'] || {}),
            [type]: { count: 0, amount: 0 },
          };
      });
      return found;
    });

    return transactionList as never;
  };
}
