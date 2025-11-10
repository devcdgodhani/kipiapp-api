import { Optional } from 'sequelize';
import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { ISubCategoryAttributes } from '../interfaces';

export type TSubCategoryCreate = Optional<ISubCategoryAttributes, 'id'>;

export type TSubCategoryRes = IApiResponse<ISubCategoryAttributes | null>;

export type TSubCategoryListRes = IApiResponse<ISubCategoryAttributes[]>;

export type TSubCategoryListPaginationRes = IPaginationApiResponse<ISubCategoryAttributes>;