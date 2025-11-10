import { UserModel } from '../../db/postgreSql';
import { IUserService } from '../contracts';
import { SequelizeCommonService } from './sequelizeCommonService';

export class UserService extends SequelizeCommonService<UserModel> implements IUserService {
  constructor() {
    super(UserModel);
  }
}
