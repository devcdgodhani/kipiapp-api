import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IProductAttributes } from '../interfaces';

export type TProductRes = IApiResponse<IProductAttributes | null>;

export type TProductListRes = IApiResponse<IProductAttributes[]>;

export type TProductListPaginationRes = IPaginationApiResponse<IProductAttributes>;