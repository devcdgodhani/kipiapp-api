import { ProductLotModel } from '../../db/postgreSql';
import { SequelizeCommonService } from '../concrete/sequelizeCommonService';

export interface IProductLotService extends SequelizeCommonService<ProductLotModel> {}
