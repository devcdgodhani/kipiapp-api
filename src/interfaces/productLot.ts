import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';

export interface IProductLotAttributes extends IDefaultAttributes {
  id: ObjectId;
  title: string;
  enTitle: string;
  sequence: number;
  parentLotId: ObjectId;
  storeId: ObjectId;
}

export interface IProductLotDocument extends Omit<IProductLotAttributes, 'id'>, Document {}
