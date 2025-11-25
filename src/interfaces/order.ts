import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';
import { ORDER_STATUS, ORDER_TYPE } from '../constants';

export interface IOrderItem {
  productId: ObjectId;
  title: string;
  enTitle: string;
  amount: number;
  payableAmount: number;
  totalUnit: number;
  pricePerUnit: number;
  amountStr: string;
  payableAmountStr: string;
  totalUnitStr: string;
  pricePerUnitStr: string;
}

export interface IOrderAttributes extends IDefaultAttributes {
  id: ObjectId;
  number: string;
  items: IOrderItem[];
  amount: number;
  payableAmount: number;
  paidAmount: number;
  amountStr: string;
  payableAmountStr: string;
  paidAmountStr: string;
  userId: string;
  storeId: string;
  expiredAt?: Date | null;
  additionalDetails: string[];
  status: ORDER_STATUS;
  type: ORDER_TYPE;
  referenceId: ObjectId; // self reference id for return
}

export interface IOrderDocument extends Omit<IOrderAttributes, 'id'>, Document {}
