import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IStoreAttributes } from '../interfaces';

export type TStoreRes = IApiResponse<IStoreAttributes | null>;

export type TStoreListRes = IApiResponse<IStoreAttributes[]>;

export type TStoreListPaginationRes = IPaginationApiResponse<IStoreAttributes>;