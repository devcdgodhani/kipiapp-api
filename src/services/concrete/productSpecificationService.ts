import { ProductSpecificationModel } from '../../db/mongodb';
import { IProductSpecificationAttributes, IProductSpecificationDocument } from '../../interfaces';
import { IProductSpecificationService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class ProductSpecificationService
  extends MongooseCommonService<IProductSpecificationAttributes, IProductSpecificationDocument>
  implements IProductSpecificationService
{
  constructor() {
    super(ProductSpecificationModel);
  }
}
