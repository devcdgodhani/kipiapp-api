import { Optional } from 'sequelize';
import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IOtpAttributes } from '../interfaces';

export type TOtpCreate = Optional<IOtpAttributes, 'id'>;

export type TOtpRes = IApiResponse<IOtpAttributes>;

export type TOtpListRes = IApiResponse<IOtpAttributes>;

export type TOtpListPaginationRes =
  IPaginationApiResponse<IOtpAttributes>;
