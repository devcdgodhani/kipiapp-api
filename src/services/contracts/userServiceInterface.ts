import { UserModel } from '../../db/postgreSql';
import { ISequelizeCommonService } from './sequelizeCommonServiceInterface';

export interface IUserService extends ISequelizeCommonService<UserModel> {}
