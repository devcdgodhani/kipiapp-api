import { ProductModel } from '../../db/mongodb';
import { IProductAttributes, IProductDocument } from '../../interfaces';
import { IProductService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class ProductService
  extends MongooseCommonService<IProductAttributes, IProductDocument>
  implements IProductService
{
  constructor() {
    super(ProductModel);
  }
}
