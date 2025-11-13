import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';
import { ORDER_STATUS } from '../constants';

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
}

export interface IOrderDocument extends Omit<IOrderAttributes, 'id'>, Document {}
