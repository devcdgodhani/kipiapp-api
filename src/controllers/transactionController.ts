import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, TRANSACTION_SUCCESS_MESSAGES } from '../constants';
import { MongooseTransactionService, TransactionService } from '../services';
import { IApiResponse } from '../interfaces';
import { TTransactionListPaginationRes, TTransactionListRes, TTransactionRes } from '../types';

export default class TransactionController {
  transactionService = new TransactionService();

  constructor() {}

  /*********** Fetch transaction ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.transactionService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const transaction = await this.transactionService.findOne(filter, options);

      const response: TTransactionRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: TRANSACTION_SUCCESS_MESSAGES.GET_SUCCESS,
        data: transaction,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.transactionService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const transactionList = await this.transactionService.findAll(filter, options);

      const response: TTransactionListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: TRANSACTION_SUCCESS_MESSAGES.GET_SUCCESS,
        data: transactionList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.transactionService.generateFilter({
        filters: reqData,
      });

      const transactionList = await this.transactionService.findAllWithPagination(filter, options);

      const response: TTransactionListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: TRANSACTION_SUCCESS_MESSAGES.GET_SUCCESS,
        data: transactionList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create transaction ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];

      await this.transactionService.bulkCreate(reqData, { userId: req.user.id, session });

      await transaction.commit();

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.CREATED.STATUS,
        code: HTTP_STATUS_CODE.CREATED.CODE,
        message: TRANSACTION_SUCCESS_MESSAGES.CREATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Update transaction ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();

    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.transactionService.generateFilter({
          filters: updateData.filter,
        });
        await this.transactionService.update(filter, updateData.update, {
          userId: req.user.id,
          session,
        });
      }
      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: TRANSACTION_SUCCESS_MESSAGES.UPDATE_SUCCESS,
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
      const { filter } = this.transactionService.generateFilter({
        filters: reqData.filter,
      });
      await this.transactionService.updateOne(filter, reqData.update, {
        userId: req.user.id,
        session,
      });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: TRANSACTION_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Delete transaction ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();
      const reqData = req.body;
      const { filter } = this.transactionService.generateFilter({
        filters: reqData,
      });

      await this.transactionService.softDelete(filter, { userId: req.user.id, session });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: TRANSACTION_SUCCESS_MESSAGES.DELETE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };
}
