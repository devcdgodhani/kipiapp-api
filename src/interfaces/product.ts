import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';

export interface IProductAttributes extends IDefaultAttributes {
  id: ObjectId;
  title: string;
  enTitle: string;
  description: string;
  enDescription: string;
  storeId: ObjectId;
}

export interface IProductDocument extends Omit<IProductAttributes, 'id'>, Document {}
