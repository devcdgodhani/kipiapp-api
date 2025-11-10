import { StoreModel } from '../../db/postgreSql';
import { SequelizeCommonService } from '../concrete/sequelizeCommonService';

export interface IStoreService extends SequelizeCommonService<StoreModel> {}
