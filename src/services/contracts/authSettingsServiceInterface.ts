import { IAuthSettingsAttributes, IAuthSettingsDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IAuthSettingsService extends IMongooseCommonService<IAuthSettingsAttributes, IAuthSettingsDocument> {}
