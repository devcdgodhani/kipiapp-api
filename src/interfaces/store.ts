import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';

export interface IStoreAttributes extends IDefaultAttributes {
  id: ObjectId;
  title: string;
  enTitle: string;
  userId: string;
}

export interface IStoreDocument extends Omit<IStoreAttributes, 'id'>, Document {}
