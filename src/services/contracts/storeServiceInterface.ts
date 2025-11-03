import { IStoreAttributes, IStoreDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IStoreService extends IMongooseCommonService<IStoreAttributes, IStoreDocument> {}
