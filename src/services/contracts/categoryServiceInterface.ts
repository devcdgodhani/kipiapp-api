import { ICategoryAttributes, ICategoryDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface ICategoryService extends IMongooseCommonService<ICategoryAttributes, ICategoryDocument> {}
