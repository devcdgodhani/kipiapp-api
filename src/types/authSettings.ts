import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IAuthSettingsAttributes } from '../interfaces';

export type TAuthSettingsCreate = Omit<IAuthSettingsAttributes, 'id'>;

export type TAuthSettingsRes = IApiResponse<IAuthSettingsAttributes>;

export type TAuthSettingsListRes = IApiResponse<IAuthSettingsAttributes>;

export type TAuthSettingsListPaginationRes =
  IPaginationApiResponse<IAuthSettingsAttributes>;
