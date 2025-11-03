import { ObjectId } from 'mongoose';
import { COMMON_STATUS } from '../constants';
import { IDefaultAttributes } from './common';

export interface ICategoryAttributes extends IDefaultAttributes {
  id: ObjectId;
  title: string;
  description: string;
  enTitle: string;
  status: COMMON_STATUS;
  storeId: ObjectId;
}

export interface ICategoryDocument extends Omit<ICategoryAttributes, 'id'>, Document {}
