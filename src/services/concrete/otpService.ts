import { OtpModel } from '../../db/postgreSql';
import { IOtpService } from '../contracts';
import { SequelizeCommonService } from './sequelizeCommonService';

export class OtpService
  extends SequelizeCommonService<OtpModel>
  implements IOtpService
{
  constructor() {
    super(OtpModel);
  }
}
