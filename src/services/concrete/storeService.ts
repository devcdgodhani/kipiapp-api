import { StoreModel } from '../../db/mongodb';
import { IStoreAttributes, IStoreDocument } from '../../interfaces';
import { IStoreService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class StoreService
  extends MongooseCommonService<IStoreAttributes, IStoreDocument>
  implements IStoreService
{
  constructor() {
    super(StoreModel);
  }
}
