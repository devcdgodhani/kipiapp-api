import { Request, Response, NextFunction } from 'express';
import {
  HTTP_STATUS_CODE,
  PRODUCT_LOT_SUCCESS_MESSAGES,
  PRODUCT_LOT_ERROR_MESSAGES,
} from '../constants';
import { MongooseTransactionService, ProductLotService } from '../services';
import { IApiResponse, IProductLotAttributes } from '../interfaces';
import { TProductLotListPaginationRes, TProductLotListRes, TProductLotRes } from '../types';
import { ApiError } from '../helpers';

export default class ProductLotController {
  productLotService = new ProductLotService();

  constructor() {}

  /*********** Fetch productLot ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productLotService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const productLot = await this.productLotService.findOne(filter, options);

      const response: TProductLotRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: PRODUCT_LOT_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productLot,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productLotService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const productLotList = await this.productLotService.findAll(filter, options);

      const response: TProductLotListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: PRODUCT_LOT_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productLotList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productLotService.generateFilter({
        filters: reqData,
        searchFields: ['title', 'enTitle'],
      });

      const productLotList = await this.productLotService.findAllWithPagination(filter, options);

      const response: TProductLotListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: PRODUCT_LOT_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productLotList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create productLot ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];

      const existProductLot = await this.productLotService.findOne({
        title: { $in: reqData.map((productLot: IProductLotAttributes) => productLot.title) },
      });
      if (existProductLot) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          PRODUCT_LOT_ERROR_MESSAGES.EXIST
        );
      }
      let sequence = 0;
      const lastProductLot = await this.productLotService.findOne({}, { sort: { sequence: -1 } });
      if (lastProductLot) sequence = lastProductLot.sequence;

      reqData = reqData.map((productLot: IProductLotAttributes) => {
        sequence = sequence + 1;
        return {
          ...productLot,
          sequence,
        };
      });

      await this.productLotService.bulkCreate(reqData, { userId: req.user.id, session });

      await transaction.commit();

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.CREATED.STATUS,
        code: HTTP_STATUS_CODE.CREATED.CODE,
        message: PRODUCT_LOT_SUCCESS_MESSAGES.CREATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Update productLot ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();

    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.productLotService.generateFilter({
          filters: updateData.filter,
        });
        await this.productLotService.update(filter, updateData.update, {
          userId: req.user.id,
          session,
        });
      }
      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: PRODUCT_LOT_SUCCESS_MESSAGES.UPDATE_SUCCESS,
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
      const { filter } = this.productLotService.generateFilter({
        filters: reqData.filter,
      });
      await this.productLotService.updateOne(filter, reqData.update, {
        userId: req.user.id,
        session,
      });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: PRODUCT_LOT_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Delete productLot ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();
      const reqData = req.body;
      const { filter } = this.productLotService.generateFilter({
        filters: reqData,
      });

      await this.productLotService.softDelete(filter, { userId: req.user.id, session });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: PRODUCT_LOT_SUCCESS_MESSAGES.DELETE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };
}
