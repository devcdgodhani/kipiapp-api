import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';
// import {
//   PRODUCT_SPECIFICATION_QUANTITY_TYPE,
//   PRODUCT_SPECIFICATION_VALUE_TYPE,
// } from '../constants';

// export interface IProductSpecification {
//   title: string;
//   enTitle: string;
//   valueType: PRODUCT_SPECIFICATION_VALUE_TYPE;
//   value: string;
//   multipleValue: string[];
//   enValue: string;
//   description: string;
//   quantityType: PRODUCT_SPECIFICATION_QUANTITY_TYPE;
// }

export interface IProductAttributes extends IDefaultAttributes {
  id: ObjectId;
  title: string;
  enTitle: string;
  description: string;
  enDescription: string;
  storeId: ObjectId;
  totalUnit: number;
  remainUnit: number;
  pricePerUnit: number;
  // specifications: IProductSpecification[];
}

export interface IProductDocument extends Omit<IProductAttributes, 'id'>, Document {}
