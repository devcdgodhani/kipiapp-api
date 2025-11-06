import { AuthTokenModel } from '../../db/postgreSql';
import { SequelizeCommonService } from '../concrete/sequelizeCommonService';

export interface IAuthTokenService extends SequelizeCommonService<AuthTokenModel> {}
