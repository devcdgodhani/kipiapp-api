import { Optional } from 'sequelize';
import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IStoreAttributes } from '../interfaces';

export type TStoreCreate = Optional<IStoreAttributes, 'id'>;

export type TStoreRes = IApiResponse<IStoreAttributes | null>;

export type TStoreListRes = IApiResponse<IStoreAttributes[]>;

export type TStoreListPaginationRes = IPaginationApiResponse<IStoreAttributes>;