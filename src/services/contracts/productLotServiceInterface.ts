import { IProductLotAttributes, IProductLotDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IProductLotService extends IMongooseCommonService<IProductLotAttributes, IProductLotDocument> {}
