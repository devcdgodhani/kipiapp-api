import { IContactAddressAttributes, IContactAddressDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IContactAddressService extends IMongooseCommonService<IContactAddressAttributes, IContactAddressDocument> {}
