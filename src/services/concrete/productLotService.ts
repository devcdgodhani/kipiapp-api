import { ProductLotModel } from '../../db/postgreSql';
import { IProductLotService } from '../contracts';
import { SequelizeCommonService } from './sequelizeCommonService';

export class ProductLotService
  extends SequelizeCommonService<ProductLotModel>
  implements IProductLotService
{
  constructor() {
    super(ProductLotModel);
  }
}
