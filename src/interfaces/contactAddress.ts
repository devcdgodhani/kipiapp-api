import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';

export interface IContactAddressAttributes extends IDefaultAttributes {
  id: ObjectId;
  title: string;
  enTitle: string;
  userId: ObjectId;
}

export interface IContactAddressDocument extends Omit<IContactAddressAttributes, 'id'>, Document {}
