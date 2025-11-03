import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, CATEGORY_SUCCESS_MESSAGES, CATEGORY_ERROR_MESSAGES } from '../constants';
import { CategoryService } from '../services';
import { IApiResponse, ICategoryAttributes } from '../interfaces';
import { TCategoryListPaginationRes, TCategoryListRes, TCategoryRes } from '../types';
import { ApiError } from '../helpers';

export default class CategoryController {
  categoryService = new CategoryService();

  constructor() {}

  /*********** Fetch category ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.categoryService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const category = await this.categoryService.findOne(filter, options);

      const response: TCategoryRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: category,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.categoryService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const categoryList = await this.categoryService.findAll(filter, options);

      const response: TCategoryListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: categoryList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.categoryService.generateFilter({
        filters: reqData,
        searchFields: ['title', 'enTitle'],
      });

      const categoryList = await this.categoryService.findAllWithPagination(filter, options);

      const response: TCategoryListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: CATEGORY_SUCCESS_MESSAGES.GET_SUCCESS,
        data: categoryList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create category ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];

      const existCategory = await this.categoryService.findOne({
        title: { $in: reqData.map((category: ICategoryAttributes) => category.title) },
      });
      if (existCategory) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          CATEGORY_ERROR_MESSAGES.EXIST
        );
      }
      await this.categoryService.bulkCreate(reqData, { userId: req.user.id });

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

  /*********** Update category ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.categoryService.generateFilter({
          filters: updateData.filter,
        });
        await this.categoryService.update(filter, updateData.update, { userId: req.user.id });
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
      const { filter } = this.categoryService.generateFilter({
        filters: reqData.filter,
      });
      await this.categoryService.updateOne(filter, reqData.update, { userId: req.user.id });

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

  /*********** Delete category ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter } = this.categoryService.generateFilter({
        filters: reqData,
      });

      await this.categoryService.softDelete(filter, { userId: req.user.id });

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
