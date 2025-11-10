import { AuthActionHistoryModel } from '../../db/postgreSql';
import { SequelizeCommonService } from '../concrete/sequelizeCommonService';

export interface IAuthActionHistoryService extends SequelizeCommonService<AuthActionHistoryModel> {}
