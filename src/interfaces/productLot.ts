import { IDefaultAttributes } from './common';

export interface IProductLotAttributes extends IDefaultAttributes {
  id: string;
  title: string;
  enTitle: string;
  sequence: number;
  storeId: string;
}