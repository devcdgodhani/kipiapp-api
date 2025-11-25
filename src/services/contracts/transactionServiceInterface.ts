import { ITransactionAttributes, ITransactionDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface ITransactionService extends IMongooseCommonService<ITransactionAttributes, ITransactionDocument> {}
