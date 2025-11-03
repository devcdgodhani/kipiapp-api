import { ISubCategoryAttributes, ISubCategoryDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface ISubCategoryService extends IMongooseCommonService<ISubCategoryAttributes, ISubCategoryDocument> {}
