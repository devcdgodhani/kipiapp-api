import { MongooseCommonService } from './mongooseCommonService';
import { IAuthSettingsService } from '../contracts/authSettingsServiceInterface';
import { AuthSettingsModel } from '../../db/mongodb';
import { IAuthSettingsAttributes, IAuthSettingsDocument } from '../../interfaces';

export class AuthSettingsService
  extends MongooseCommonService<IAuthSettingsAttributes, IAuthSettingsDocument>
  implements IAuthSettingsService
{
  constructor() {
    super(AuthSettingsModel);
  }
}
