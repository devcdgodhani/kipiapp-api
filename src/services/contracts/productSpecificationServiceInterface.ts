import { IProductSpecificationAttributes, IProductSpecificationDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IProductSpecificationService extends IMongooseCommonService<IProductSpecificationAttributes, IProductSpecificationDocument> {}
