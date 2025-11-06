import { AUTH_ACTION_TYPE } from '../constants';
import { IDefaultAttributes } from './common';

export interface IAuthActionHistoryAttributes extends IDefaultAttributes {
  id: string;
  userId: string;
  type: AUTH_ACTION_TYPE;
  actionAt: number;
  deviceId: string;
  deviceIp: boolean;
}

export interface IAuthActionHistoryDocument
  extends Omit<IAuthActionHistoryAttributes, 'id'>,
    Document {}
