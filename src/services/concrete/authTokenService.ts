import { AuthTokenModel } from '../../db/postgreSql';
import { IAuthTokenService } from '../contracts';
import { SequelizeCommonService } from './sequelizeCommonService';

export class AuthTokenService
  extends SequelizeCommonService<AuthTokenModel>
  implements IAuthTokenService
{
  constructor() {
    super(AuthTokenModel);
  }
}
