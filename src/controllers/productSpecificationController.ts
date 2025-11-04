import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, CATEGORY_SUCCESS_MESSAGES, CATEGORY_ERROR_MESSAGES } from '../constants';
import { ProductSpecificationService } from '../services';
import { IApiResponse, IProductSpecificationAttributes } from '../interfaces';
import { TProductSpecificationListPaginationRes, TProductSpecificationListRes, TProductSpecificationRes } from '../types';
import { ApiError } from '../helpers';

export default class ProductSpecificationController {
  productSpecificationService = new ProductSpecificationService();

  constructor() {}

  /*********** Fetch productSpecification ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productSpecificationService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const productSpecification = await this.productSpecificationService.findOne(filter, options);

      const response: TProductSpecificationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productSpecification,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productSpecificationService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const productSpecificationList = await this.productSpecificationService.findAll(filter, options);

      const response: TProductSpecificationListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productSpecificationList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.productSpecificationService.generateFilter({
        filters: reqData,
        searchFields: ['title', 'enTitle'],
      });

      const productSpecificationList = await this.productSpecificationService.findAllWithPagination(filter, options);

      const response: TProductSpecificationListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: productSpecificationList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create productSpecification ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];

      const existProductSpecification = await this.productSpecificationService.findOne({
        title: { $in: reqData.map((productSpecification: IProductSpecificationAttributes) => productSpecification.title) },
        storeId: req.store.id,
      });
      if (existProductSpecification) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          CATEGORY_ERROR_MESSAGES.EXIST
        );
      }
      await this.productSpecificationService.bulkCreate(reqData, { userId: req.user.id });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.CREATED.STATUS,
        code: HTTP_STATUS_CODE.CREATED.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.CREATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Update productSpecification ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.productSpecificationService.generateFilter({
          filters: updateData.filter,
        });
        await this.productSpecificationService.update(filter, updateData.update, { userId: req.user.id });
      }
      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  updateOneByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter } = this.productSpecificationService.generateFilter({
        filters: reqData.filter,
      });
      await this.productSpecificationService.updateOne(filter, reqData.update, { userId: req.user.id });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Delete productSpecification ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter } = this.productSpecificationService.generateFilter({
        filters: reqData,
      });

      await this.productSpecificationService.softDelete(filter, { userId: req.user.id });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.DELETE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };
}
