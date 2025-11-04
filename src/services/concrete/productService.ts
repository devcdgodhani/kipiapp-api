import { PRODUCT_SKU_START } from '../../constants';
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
  generateUniqueSku = async (): Promise<string> => {
    let sku = PRODUCT_SKU_START;
    const exist = await this.findOne({}, { sort: { createdAt: -1 } });
    if (exist) sku = Number(exist.sku);
    return `sku${sku + 1}`;
  };
}
