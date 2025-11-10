import { AuthActionHistoryModel } from '../../db/postgreSql';
import { IAuthActionHistoryService } from '../contracts/authActionHistoryServiceInterface';
import { SequelizeCommonService } from './sequelizeCommonService';

export class AuthActionHistoryService
  extends SequelizeCommonService<AuthActionHistoryModel>
  implements IAuthActionHistoryService
{
  constructor() {
    super(AuthActionHistoryModel);
  }
}
