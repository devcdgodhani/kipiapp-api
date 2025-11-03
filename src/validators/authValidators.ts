import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError, mongooseToJoi } from '../helpers';
import { HTTP_STATUS_CODE, OTP_TYPE, USER_TYPE } from '../constants';
import { UserSchema } from '../db/mongodb';
import { IUserAttributes } from '../interfaces';

const options = {
  abortEarly: false, // include all errors
  allowUnknown: false, // disallow unknown props
};

export default class AuthValidator {
  private validate(schema: Joi.ObjectSchema, req: Request, next: NextFunction) {
    const { error, value: requestBody } = schema.validate(
      { ...req.query, ...req.params, ...req.body },
      options
    );

    if (error) {
      const errorMessage = error.details
        .map((detail) => {
          if (detail.context?.message) {
            return `${detail.message}${detail.context.message}`;
          }
          return detail.message;
        })
        .join(', ');
      throw new ApiError(
        HTTP_STATUS_CODE.BAD_REQUEST.CODE,
        HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
        errorMessage
      );
    }

    req.body = requestBody;
    next();
  }

  /*********************** register ***********************/
  registerValidator = (req: Request, res: Response, next: NextFunction) => {
    const createSchema = mongooseToJoi<IUserAttributes>({
      schema: UserSchema,
      includeFields: [
        'email',
        'mobile',
        'password',
        'firstName',
        'lastName',
        'countryCode',
        'type',
        'gender',
      ],
      requiredFields: ['email', 'mobile', 'password', 'firstName', 'lastName', 'countryCode'],
    });
    const schema = Joi.object({ ...createSchema });
    try {
      this.validate(schema, req, next);
    } catch (err) {
      next(err);
    }
  };

  /*********************** login ***********************/
  loginValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      type: Joi.string()
        .valid(...Object.values(USER_TYPE))
        .required(),
    });

    try {
      this.validate(schema, req, next);
    } catch (err) {
      next(err);
    }
  };

  /*********************** refresh tokens ***********************/
  refreshTokensValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      refreshToken: Joi.string().required(),
    });

    try {
      this.validate(schema, req, next);
    } catch (err) {
      next(err);
    }
  };

  /*********************** change password ***********************/
  changePasswordValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      password: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    });

    try {
      this.validate(schema, req, next);
    } catch (err) {
      next(err);
    }
  };

  /*********************** send OTP ***********************/
  sendOtpValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      type: Joi.string()
        .valid(...Object.values(USER_TYPE))
        .required(),
      otpType: Joi.string()
        .valid(...Object.values(OTP_TYPE))
        .required(),
    });

    try {
      this.validate(schema, req, next);
    } catch (err) {
      next(err);
    }
  };

  /*********************** verify OTP ***********************/
  verifyOtpValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      otp: Joi.string().length(6).optional(),
      token: Joi.string().optional(),
      otpType: Joi.string()
        .valid(...Object.values(OTP_TYPE))
        .optional(),
    });

    try {
      this.validate(schema, req, next);
    } catch (err) {
      next(err);
    }
  };

  /*********************** forget password ***********************/
  forgetPasswordValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      newPassword: Joi.string().min(6).required(),
    });

    try {
      this.validate(schema, req, next);
    } catch (err) {
      next(err);
    }
  };
}
