import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';
import { TRANSACTION_ACTION, TRANSACTION_REFERENCE_MODULE } from '../constants';

export interface ITransactionAttributes extends IDefaultAttributes {
  id: ObjectId;
  date: Date;
  referenceId: string; //id of order or any other income and expense
  amount: number;
  amountStr: string;
  action: TRANSACTION_ACTION;
  description: string;
  enDescription: string;
  referenceType: string; // string for order type or any income or expense type
  storeId: string;
  referenceModule: TRANSACTION_REFERENCE_MODULE;
}

export interface ITransactionDocument extends Omit<ITransactionAttributes, 'id'>, Document {}
