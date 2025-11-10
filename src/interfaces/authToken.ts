import { TOKEN_TYPE } from '../constants';
import { IDefaultAttributes } from './common';

export interface IAuthTokenAttributes extends IDefaultAttributes {
  id: string;
  token: string;
  type: TOKEN_TYPE;
  userId: string;
  expiredAt: number;
  referenceTokenId?: string;
}