import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { ISubCategoryAttributes } from '../interfaces';

export type TSubCategoryRes = IApiResponse<ISubCategoryAttributes | null>;

export type TSubCategoryListRes = IApiResponse<ISubCategoryAttributes[]>;

export type TSubCategoryListPaginationRes = IPaginationApiResponse<ISubCategoryAttributes>;