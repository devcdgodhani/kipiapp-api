import { ProductLotModel } from '../../db/mongodb';
import { IProductLotAttributes, IProductLotDocument } from '../../interfaces';
import { IProductLotService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class ProductLotService
  extends MongooseCommonService<IProductLotAttributes, IProductLotDocument>
  implements IProductLotService
{
  constructor() {
    super(ProductLotModel);
  }
}
