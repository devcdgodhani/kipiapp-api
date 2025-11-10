import { IDefaultAttributes } from './common';
import {
  PRODUCT_SPECIFICATION_QUANTITY_TYPE,
  PRODUCT_SPECIFICATION_VALUE_TYPE,
} from '../constants';

export interface IProductSpecificationAttributes extends IDefaultAttributes {
  title: string; //height,weight, length, size, etc...
  enTitle: string;
  valueType: PRODUCT_SPECIFICATION_VALUE_TYPE;
  value: string;
  multipleValue: string[];
  enValue: string;
  description: string;
  quantityType: PRODUCT_SPECIFICATION_QUANTITY_TYPE;
  userId: string;
  storeId: string;
  uuid: string; // if specification direct added from product. then uuid will be generated from frontend
}

export interface IProductSpecificationDocument
  extends Omit<IProductSpecificationAttributes, 'id'>,
    Document {}
