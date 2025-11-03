import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IProductLotAttributes } from '../interfaces';

export type TProductLotRes = IApiResponse<IProductLotAttributes | null>;

export type TProductLotListRes = IApiResponse<IProductLotAttributes[]>;

export type TProductLotListPaginationRes = IPaginationApiResponse<IProductLotAttributes>;