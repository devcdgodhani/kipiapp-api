import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, SUB_CATEGORY_SUCCESS_MESSAGES, SUB_CATEGORY_ERROR_MESSAGES } from '../constants';
import { SubCategoryService } from '../services';
import { IApiResponse, ISubCategoryAttributes } from '../interfaces';
import { TSubCategoryListPaginationRes, TSubCategoryListRes, TSubCategoryRes } from '../types';
import { ApiError } from '../helpers';

export default class SubCategoryController {
  subSubCategoryService = new SubCategoryService();

  constructor() {}

  /*********** Fetch subSubCategory ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.subSubCategoryService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const subSubCategory = await this.subSubCategoryService.findOne(filter, options);

      const response: TSubCategoryRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: SUB_CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: subSubCategory,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.subSubCategoryService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const subSubCategoryList = await this.subSubCategoryService.findAll(filter, options);

      const response: TSubCategoryListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: SUB_CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: subSubCategoryList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.subSubCategoryService.generateFilter({
        filters: reqData,
        searchFields: ['title', 'enTitle'],
      });

      const subSubCategoryList = await this.subSubCategoryService.findAllWithPagination(
        filter,
        options
      );

      const response: TSubCategoryListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: SUB_CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: subSubCategoryList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create subSubCategory ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];

      const existSubCategory = await this.subSubCategoryService.findOne({
        $or: reqData.map((subCategory: ISubCategoryAttributes) => ({
          categoryId: subCategory.categoryId,
          title: subCategory.title,
        })),
      });

      if (existSubCategory) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          SUB_CATEGORY_ERROR_MESSAGES.EXIST
        );
      }

      await this.subSubCategoryService.bulkCreate(reqData, { userId: req.user.id });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.CREATED.STATUS,
        code: HTTP_STATUS_CODE.CREATED.CODE,
        message: SUB_CATEGORY_SUCCESS_MESSAGES.CREATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Update subSubCategory ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.subSubCategoryService.generateFilter({
          filters: updateData.filter,
        });
        await this.subSubCategoryService.update(filter, updateData.update, { userId: req.user.id });
      }
      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: SUB_CATEGORY_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  updateOneByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter } = this.subSubCategoryService.generateFilter({
        filters: reqData.filter,
      });
      await this.subSubCategoryService.updateOne(filter, reqData.update, { userId: req.user.id });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: SUB_CATEGORY_SUCCESS_MESSAGES.UPDATE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Delete subSubCategory ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter } = this.subSubCategoryService.generateFilter({
        filters: reqData,
      });

      await this.subSubCategoryService.softDelete(filter, { userId: req.user.id });

      const response: IApiResponse = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: SUB_CATEGORY_SUCCESS_MESSAGES.DELETE_SUCCESS,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };
}
