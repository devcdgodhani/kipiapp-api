import { IProductAttributes, IProductDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IProductService
  extends IMongooseCommonService<IProductAttributes, IProductDocument> {
  generateUniqueSku: () => Promise<string>;
}
