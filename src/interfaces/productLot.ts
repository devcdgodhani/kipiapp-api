import { PRODUCT_LOT_TYPE } from '../constants';
import { IDefaultAttributes } from './common';

export interface IProductLotAttributes extends IDefaultAttributes {
  id: string;
  title: string;
  enTitle: string;
  sequence: number;
  storeId: string;
  amount: number;
  vendorId: string;
  type: PRODUCT_LOT_TYPE;
  parentLotId: string;
  date: Date;
}
