import { Request, Response, NextFunction } from 'express';
import {
  HTTP_STATUS_CODE,
  ORDER_ERROR_MESSAGES,
  ORDER_STATUS,
  ORDER_SUCCESS_MESSAGES,
  ORDER_TYPE,
  TRANSACTION_ACTION,
  TRANSACTION_REFERENCE_MODULE,
} from '../constants';
import { MongooseTransactionService, OrderService, TransactionService } from '../services';
import { IApiResponse, IOrderAttributes } from '../interfaces';
import { TOrderListPaginationRes, TOrderListRes, TOrderRes, TTransactionCreate } from '../types';
import { ApiError } from '../helpers';

export default class OrderController {
  orderService = new OrderService();
  transactionService = new TransactionService();

  constructor() {}

  /*********** Fetch order ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.orderService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const order = await this.orderService.findOne(filter, options);

      const response: TOrderRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: ORDER_SUCCESS_MESSAGES.GET_SUCCESS,
        data: order,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.orderService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const orderList = await this.orderService.findAll(filter, options);

      const response: TOrderListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: ORDER_SUCCESS_MESSAGES.GET_SUCCESS,
        data: orderList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.orderService.generateFilter({
        filters: reqData,
        searchFields: [],
      });

      const orderList = await this.orderService.findAllWithPagination(filter, options);

      const response: TOrderListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: ORDER_SUCCESS_MESSAGES.GET_SUCCESS,
        data: orderList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create order ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();

      const reqData = req.body;
      reqData.number = await this.orderService.generateUniqueOrderNumber();

      const createdOrder = await this.orderService.create(reqData, {
        userId: req.user.id,
        session,
      });

      await transaction.commit();

      const response: IApiResponse<IOrderAttributes> = {
        status: HTTP_STATUS_CODE.CREATED.STATUS,
        code: HTTP_STATUS_CODE.CREATED.CODE,
        message: ORDER_SUCCESS_MESSAGES.CREATE_SUCCESS,
        data: createdOrder,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Update order ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();

    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.orderService.generateFilter({
          filters: updateData.filter,
        });
        await this.orderService.update(filter, updateData.update, {
          userId: req.user.id,
          session,
        });
      }
      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: ORDER_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  updateOneByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();
      const reqData = req.body;
      const { filter } = this.orderService.generateFilter({
        filters: reqData.filter,
      });

      let order = await this.orderService.findOne(filter);
      if (!order) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          ORDER_ERROR_MESSAGES.NOT_FOUND
        );
      }

      if (order.status === ORDER_STATUS.CANCELLED) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          ORDER_ERROR_MESSAGES.NOT_FOUND
        );
      }

      await this.orderService.updateOne(filter, reqData.update, {
        userId: req.user.id,
        session,
      });

      const exitTransaction = await this.transactionService.findOne({
        referenceId: order.id.toString(),
      });

      if (ORDER_STATUS.CANCELLED === reqData?.update?.status && exitTransaction) {
        await this.transactionService.softDelete({ referenceId: order.id.toString() });
      }

      if (ORDER_STATUS.PLACED === reqData?.update?.status) {
        order = { ...order, ...reqData.update } as IOrderAttributes;

        const newTransaction = {
          amount: order?.paidAmount,
          referenceId: order.number,
          referenceModule: TRANSACTION_REFERENCE_MODULE.ORDER,
          referenceType: order.type,
          storeId: order.storeId,
          date: new Date(),
        } as TTransactionCreate;

        if ([ORDER_TYPE.PURCHASE, ORDER_TYPE.SELL_RETURN].includes(order.type)) {
          newTransaction.action = TRANSACTION_ACTION.DEBIT;
        }

        if ([ORDER_TYPE.SELL, ORDER_TYPE.PURCHASE_RETURN].includes(order.type)) {
          newTransaction.action = TRANSACTION_ACTION.CREDIT;
        }
        await this.transactionService.create(newTransaction);
      }

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: ORDER_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Delete order ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();
      const reqData = req.body;
      const { filter } = this.orderService.generateFilter({
        filters: reqData,
      });

      await this.orderService.softDelete(filter, { userId: req.user.id, session });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: ORDER_SUCCESS_MESSAGES.DELETE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };
}
