import { IOrderAttributes, IOrderDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IOrderService extends IMongooseCommonService<IOrderAttributes, IOrderDocument> {
    generateUniqueOrderNumber: () => Promise<string>;
}
