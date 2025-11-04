import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IProductSpecificationAttributes } from '../interfaces';

export type TProductSpecificationRes = IApiResponse<IProductSpecificationAttributes | null>;

export type TProductSpecificationListRes = IApiResponse<IProductSpecificationAttributes[]>;

export type TProductSpecificationListPaginationRes = IPaginationApiResponse<IProductSpecificationAttributes>;