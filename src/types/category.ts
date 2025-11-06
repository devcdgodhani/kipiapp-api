import { Optional } from 'sequelize';
import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { ICategoryAttributes } from '../interfaces';

export type TCategoryCreate = Optional<ICategoryAttributes, 'id'>;

export type TCategoryRes = IApiResponse<ICategoryAttributes | null>;

export type TCategoryListRes = IApiResponse<ICategoryAttributes[]>;

export type TCategoryListPaginationRes = IPaginationApiResponse<ICategoryAttributes>;