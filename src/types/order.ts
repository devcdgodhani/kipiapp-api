import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IOrderAttributes } from '../interfaces';

export type TOrderRes = IApiResponse<IOrderAttributes | null>;

export type TOrderListRes = IApiResponse<IOrderAttributes[]>;

export type TOrderListPaginationRes = IPaginationApiResponse<IOrderAttributes>;