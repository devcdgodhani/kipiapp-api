import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';
import { IProductSpecificationAttributes } from './productSpecification';
import { PRODUCT_COMMON_STATUS } from '../constants';

export interface IProductAttributes extends IDefaultAttributes {
  id: ObjectId;
  title: string;
  sku: string;
  vendorId: string;
  lotId: string[];
  categoryId: string;
  subCategoryId: string;
  enTitle: string;
  description: string;
  enDescription: string;
  storeId: string;
  totalUnit: number;
  soldUnit: number;
  pricePerUnit: number;
  basePricePerUnit: number;
  specifications: IProductSpecificationAttributes[];
  status: PRODUCT_COMMON_STATUS;
  qrCode: string;
}

export interface IProductDocument extends Omit<IProductAttributes, 'id'>, Document {}
