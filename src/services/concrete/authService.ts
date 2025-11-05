import { FilterQuery } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import ejs from 'ejs';
import { IAuthService } from '../contracts';
import { ENV_VARIABLE } from '../../configs';
import {
  TOKEN_TYPE,
  HTTP_STATUS_CODE,
  AUTH_ERROR_MESSAGES,
  OTP_TYPE,
  AUTH_TOKEN_EXPIRATION_IN_MINUTES,
  EJS_TEMPLATES,
  EMAIL_SUBJECT_MESSAGE,
  APP_DETAILS,
} from '../../constants';
import { ApiError, generateOtp, sendEmail } from '../../helpers';
import { IAuthTokenAttributes, IUserAttributes } from '../../interfaces';
import { AuthTokenService } from './authTokenService';
import { OtpService } from './otpService';
import { UserService } from './userService';
import { TOtpCreate } from '../../types/otp';
import { addMinutes, getTime, getUnixTime } from 'date-fns';
import { TAuthTokenCreate } from '../../types/authToken';
import { TGenerateTokenParams } from '../../types';

export class AuthService implements IAuthService {
  private userService = new UserService();
  private authTokenService = new AuthTokenService();
  private otpService = new OtpService();
  constructor() {}

  checkUserAccountExist = async (
    user: Partial<IUserAttributes>
  ): Promise<IUserAttributes | null> => {
    const where: FilterQuery<IUserAttributes> = {};
    if (user.email) where.email = user.email.toLowerCase();
    if (user.type) where.type = user.type;
    if (user.mobile) where.mobile = user.mobile;
    return await this.userService.findOne(where);
  };

  generateUserTokens = async (tokenData: TGenerateTokenParams): Promise<IAuthTokenAttributes> => {
    try {
      const exp = getUnixTime(addMinutes(new Date(), tokenData.expiredAt));
      await this.authTokenService.delete({ userId: tokenData.userId, type: tokenData.tokenType });
      const payload: JwtPayload = {
        sub: tokenData.userId.toString(),
        iat: getUnixTime(new Date()),
        exp,
        type: tokenData.tokenType,
      };
      if (tokenData.otpType) payload.otpType = tokenData.otpType;

      const token = jwt.sign(payload, ENV_VARIABLE.JWT_SECRET);
      const tokenCreateData: TAuthTokenCreate = {
        userId: tokenData.userId,
        token,
        expiredAt: exp,
        type: tokenData.tokenType,
      };

      if (tokenData.referenceTokenId) tokenCreateData.referenceTokenId = tokenData.referenceTokenId;
      const authToken = await this.authTokenService.create(tokenCreateData);
      return authToken;
    } catch (err) {
      throw err;
    }
  };

  verifyPassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
  };

  generateHashPassword = async (password: string): Promise<string> => {
    return bcrypt.hashSync(password as string, 10);
  };

  userLogin = async (
    loginData: Pick<IUserAttributes, 'username' | 'password' | 'type'>
  ): Promise<Omit<IUserAttributes, 'password'>> => {
    try {
      const user = await this.userService.findOne({
        $or: [
          { email: loginData.username.toLowerCase() },
          { mobile: loginData.username },
          { username: loginData.username },
        ],
        type: loginData.type,
      });

      if (!user) {
        throw new ApiError(
          HTTP_STATUS_CODE.BAD_REQUEST.CODE,
          HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
          AUTH_ERROR_MESSAGES.INVALID_USERNAME
        );
      }

      const isPasswordValid = await this.verifyPassword(
        loginData.password || '',
        user.password || ''
      );
      if (!isPasswordValid) {
        throw new ApiError(
          HTTP_STATUS_CODE.UNAUTHORIZED.CODE,
          HTTP_STATUS_CODE.UNAUTHORIZED.STATUS,
          AUTH_ERROR_MESSAGES.INVALID_PASSWORD
        );
      }
      if (!user.isVerified) {
        throw new ApiError(
          HTTP_STATUS_CODE.UNAUTHORIZED.CODE,
          HTTP_STATUS_CODE.UNAUTHORIZED.STATUS,
          AUTH_ERROR_MESSAGES.PENDING_ACCOUNT_VERIFICATION
        );
      }
      delete user.password;
      return user;
    } catch (err) {
      throw err;
    }
  };

  sendOtpAndGetOtpToken = async (
    user: IUserAttributes,
    type: OTP_TYPE,
    maxUses: number = 1
  ): Promise<IAuthTokenAttributes> => {
    try {
      const expiredAt = getTime(addMinutes(new Date(), AUTH_TOKEN_EXPIRATION_IN_MINUTES.OTP_TOKEN));

      const generateTokens: TOKEN_TYPE[] = [];

      switch (type) {
        case OTP_TYPE.ACCOUNT_CREATE:
          generateTokens.push(TOKEN_TYPE.ACCESS_TOKEN);
          generateTokens.push(TOKEN_TYPE.REFRESH_TOKEN);
          break;

        case OTP_TYPE.FORGET_PASSWORD:
          generateTokens.push(TOKEN_TYPE.FORGET_PASSWORD_TOKEN);
          break;
        default:
          break;
      }

      const newOtp = generateOtp();
      let otp: TOtpCreate = {
        userId: user.id,
        code: newOtp,
        type,
        generateTokens,
        maxUses,
        expiredAt,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      otp = await this.otpService.create(otp, { userId: user.id });

      const token = await this.generateUserTokens({
        userId: user.id,
        tokenType: TOKEN_TYPE.OTP_TOKEN,
        expiredAt: AUTH_TOKEN_EXPIRATION_IN_MINUTES.OTP_TOKEN,
        otpType: type,
      });

      if (user.email) {
        const html = await ejs.renderFile(EJS_TEMPLATES.EMAIL_OTP, {
          username: user.username || `${user.firstName} ${user.lastName}`,
          otp: newOtp,
          appName: APP_DETAILS.APP_NAME,
          supportEmail: APP_DETAILS.SUPPORT_EMAIL,
          expiresIn: `${AUTH_TOKEN_EXPIRATION_IN_MINUTES.OTP_TOKEN} minutes`,
        });
        await sendEmail({
          to: user.email,
          subject: EMAIL_SUBJECT_MESSAGE.EMAIL_OTP,
          html,
        });
      }
      if (user.mobile) {
        // await sendSMS({
        //   phoneNumber: `${user.countryCode}${user.mobile}`,
        //   carrier: 'idea',
        //   message: `Your Verification otp is ${newOtp}`,
        // });
      }
      return token;
    } catch (err) {
      throw err;
    }
  };

  generateUniqueUsername = async (email: string): Promise<string> => {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Invalid email');
    }

    const [localPart, domain] = email.toLowerCase().split('@');

    // Normalize local part: remove dots, strip +tag, lowercase
    let base = localPart.split('+')[0].replace(/\./g, '');
    base = base.replace(/[^a-z0-9_-]/g, '');
    if (base.length === 0) base = 'user';

    const domainHint = (domain?.split('.')[0] || '').replace(/[^a-z0-9]/g, '');

    // Generate candidate usernames
    const candidates: string[] = [];
    candidates.push(base);
    if (domainHint && domainHint !== base) candidates.push(`${base}_${domainHint}`);
    for (let i = 1; i <= 10; i++) {
      candidates.push(`${base}${i}`);
      if (domainHint) candidates.push(`${base}_${domainHint}${i}`);
    }

    // Check each candidate in the DB
    for (const candidate of candidates) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await this.userService.findOne({ username: candidate });
      if (!exists) return candidate;
    }

    // If all taken, fallback to random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${base}_${randomSuffix}`;
  };
}
