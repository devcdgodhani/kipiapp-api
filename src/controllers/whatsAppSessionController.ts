import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, STORE_SUCCESS_MESSAGES } from '../constants';
import { MongooseTransactionService, WhatsAppSessionService } from '../services';
import { IApiResponse } from '../interfaces';
import {
  TWhatsAppSessionListPaginationRes,
  TWhatsAppSessionListRes,
  TWhatsAppSessionRes,
} from '../types';

export default class WhatsAppSessionController {
  whatsAppSessionService = new WhatsAppSessionService();

  constructor() {}

  /*********** Fetch whatsAppSession ***********/
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.whatsAppSessionService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const whatsAppSession = await this.whatsAppSessionService.findOne(filter, options);

      const response: TWhatsAppSessionRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: whatsAppSession,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.whatsAppSessionService.generateFilter({
        filters: reqData,
        // searchFields: ['email'],
      });

      const whatsAppSessionList = await this.whatsAppSessionService.findAll(filter, options);

      const response: TWhatsAppSessionListRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: whatsAppSessionList,
      };
      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  getWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData = req.body;
      const { filter, options } = this.whatsAppSessionService.generateFilter({
        filters: reqData,
      });

      const whatsAppSessionList = await this.whatsAppSessionService.findAllWithPagination(
        filter,
        options
      );

      const response: TWhatsAppSessionListPaginationRes = {
        status: HTTP_STATUS_CODE.OK.STATUS,
        code: HTTP_STATUS_CODE.OK.CODE,
        message: STORE_SUCCESS_MESSAGES.GET_SUCCESS,
        data: whatsAppSessionList,
      };

      return res.status(response.status).json(response);
    } catch (err) {
      return next(err);
    }
  };

  /*********** Create whatsAppSession ***********/
  create = async (req: Request, res: Response, next: NextFunction) => {
    // const transaction = new MongooseTransactionService();
    try {
      // const session = await transaction.start();

      const reqData = req.body;
      reqData.userId = reqData.userId || req.user.id;

      const whatsAppSession = await this.whatsAppSessionService.create(reqData, {
        userId: req.user.id,
        // session,
      });

      await this.whatsAppSessionService.createClient(whatsAppSession.clientId, { headless: true });
      const qrDataUrl = await this.whatsAppSessionService.generateQrDataUrl(
        whatsAppSession.clientId,
        30000
      );

      // await transaction.commit();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const response: IApiResponse<any> = {
      //   status: HTTP_STATUS_CODE.CREATED.STATUS,
      //   code: HTTP_STATUS_CODE.CREATED.CODE,
      //   message: STORE_SUCCESS_MESSAGES.CREATE_SUCCESS,
      //   data: { clientId: whatsAppSession.clientId, qr: qrDataUrl },
      // };

      // return res.status(response.status).json(response);
      res.send(qrDataUrl);
    } catch (err) {
      // await transaction.rollback();
      return next(err);
    }
  };

  /*********** Update whatsAppSession ***********/
  updateManyByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();

    try {
      const session = await transaction.start();

      let reqData = req.body;
      if (!Array.isArray(reqData)) reqData = [reqData];
      for (const updateData of reqData) {
        const { filter } = this.whatsAppSessionService.generateFilter({
          filters: updateData.filter,
        });
        await this.whatsAppSessionService.update(filter, updateData.update, {
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
      const { filter } = this.whatsAppSessionService.generateFilter({
        filters: reqData.filter,
      });
      await this.whatsAppSessionService.updateOne(filter, reqData.update, {
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

  /*********** Delete whatsAppSession ***********/
  deleteByFilter = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = new MongooseTransactionService();
    try {
      const session = await transaction.start();
      const reqData = req.body;
      const { filter } = this.whatsAppSessionService.generateFilter({
        filters: reqData,
      });

      await this.whatsAppSessionService.softDelete(filter, { userId: req.user.id, session });

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
