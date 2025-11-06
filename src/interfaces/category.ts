import { COMMON_STATUS } from '../constants';
import { IDefaultAttributes } from './common';

export interface ICategoryAttributes extends IDefaultAttributes {
  id: string;
  title: string;
  description: string;
  enTitle: string;
  status: COMMON_STATUS;
  storeId: string;
}
