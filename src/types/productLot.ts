import { Optional } from 'sequelize';
import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IProductLotAttributes } from '../interfaces';

export type TProductLotCreate = Optional<IProductLotAttributes, 'id'>;

export type TProductLotRes = IApiResponse<IProductLotAttributes | null>;

export type TProductLotListRes = IApiResponse<IProductLotAttributes[]>;

export type TProductLotListPaginationRes = IPaginationApiResponse<IProductLotAttributes>;