import { ObjectId } from 'mongoose';
import { TOKEN_TYPE } from '../constants';
import { IDefaultAttributes } from './common';

export interface IAuthTokenAttributes extends IDefaultAttributes {
  id: ObjectId;
  token: string;
  type: TOKEN_TYPE;
  userId: ObjectId;
  expiredAt: number;
  referenceTokenId?: ObjectId;
}

export interface IAuthTokenDocument extends Omit<IAuthTokenAttributes, 'id'>, Document {}
