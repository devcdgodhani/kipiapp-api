import { COMMON_STATUS } from '../constants';
import { IDefaultAttributes } from './common';

export interface IStoreAttributes extends IDefaultAttributes {
  id: string;
  title: string;
  enTitle: string;
  userId: string;
  status: COMMON_STATUS;
}
