import { COMMON_STATUS } from '../constants';
import { IDefaultAttributes } from './common';

export interface ISubCategoryAttributes extends IDefaultAttributes {
  id: string;
  title: string;
  description: string;
  enTitle: string;
  categoryId: string;
  status: COMMON_STATUS;
  storeId: string;
}
