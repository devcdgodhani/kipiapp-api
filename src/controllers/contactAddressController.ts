import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, STORE_SUCCESS_MESSAGES, STORE_ERROR_MESSAGES } from '../constants';
import { MongooseTransactionService, ContactAddressService } from '../services';
import { IApiResponse, IContactAddressAttributes } from '../interfaces';
import { TContactAddressListPaginationRes, TContactAddressListRes, TContactAddressRes } from '../types';
import { ApiError } from '../helpers';

export default class ContactAddressController {
  contactAddressService = new ContactAddressService();

  constructor() {}

  /*********** Fetch contactAddress ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.contactAddressService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const contactAddress = await this.contactAddressService.findOne(filter, options);

      const response: TContactAddressRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: contactAddress,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.contactAddressService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const contactAddressList = await this.contactAddressService.findAll(filter, options);

      const response: TContactAddressListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: contactAddressList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.contactAddressService.generateFilter({
        filters: reqData,
        searchFields: ['title', 'enTitle'],
      });

      const contactAddressList = await this.contactAddressService.findAllWithPagination(filter, options);

      const response: TContactAddressListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: contactAddressList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create contactAddress ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];

      const existSubCategory = await this.contactAddressService.findOne({
        $or: reqData.map((subCategory: IContactAddressAttributes) => ({
          userId: subCategory.userId,
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

      await this.contactAddressService.bulkCreate(reqData, { userId: req.user.id, session });

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

  /*********** Update contactAddress ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();

    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.contactAddressService.generateFilter({
          filters: updateData.filter,
        });
        await this.contactAddressService.update(filter, updateData.update, {
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
      const { filter } = this.contactAddressService.generateFilter({
        filters: reqData.filter,
      });
      await this.contactAddressService.updateOne(filter, reqData.update, {
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

  /*********** Delete contactAddress ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();
      const reqData = req.body;
      const { filter } = this.contactAddressService.generateFilter({
        filters: reqData,
      });

      await this.contactAddressService.softDelete(filter, { userId: req.user.id, session });

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
