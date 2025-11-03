import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, STORE_SUCCESS_MESSAGES, STORE_ERROR_MESSAGES } from '../constants';
import { MongooseTransactionService, ProductService } from '../services';
import { IApiResponse, IProductAttributes } from '../interfaces';
import { TProductListPaginationRes, TProductListRes, TProductRes } from '../types';
import { ApiError } from '../helpers';

export default class ProductController {
  productService = new ProductService();

  constructor() {}

  /*********** Fetch product ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const product = await this.productService.findOne(filter, options);

      const response: TProductRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: product,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const productList = await this.productService.findAll(filter, options);

      const response: TProductListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productService.generateFilter({
        filters: reqData,
        searchFields: ['title', 'enTitle'],
      });

      const productList = await this.productService.findAllWithPagination(filter, options);

      const response: TProductListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create product ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];

      const existSubCategory = await this.productService.findOne({
        $or: reqData.map((subCategory: IProductAttributes) => ({
          storeId: subCategory.storeId,
          title: subCategory.title,
        })),
      });

      if (existSubCategory) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          STORE_ERROR_MESSAGES.EXIST
        );
      }

      await this.productService.bulkCreate(reqData, { userId: req.user.id, session });

      await transaction.commit();

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.CREATED.STATUS,
        code: HTTP_STATUS_CODE.CREATED.CODE,
        message: STORE_SUCCESS_MESSAGES.CREATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Update product ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();

    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.productService.generateFilter({
          filters: updateData.filter,
        });
        await this.productService.update(filter, updateData.update, {
          userId: req.user.id,
          session,
        });
      }
      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.UPDATE_SUCCESS,
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
      const { filter } = this.productService.generateFilter({
        filters: reqData.filter,
      });
      await this.productService.updateOne(filter, reqData.update, {
        userId: req.user.id,
        session,
      });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };

  /*********** Delete product ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();
      const reqData = req.body;
      const { filter } = this.productService.generateFilter({
        filters: reqData,
      });

      await this.productService.softDelete(filter, { userId: req.user.id, session });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.DELETE_SUCCESS,
      };
      await transaction.commit();
      return res.status(response.status).json(response);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  };
}
