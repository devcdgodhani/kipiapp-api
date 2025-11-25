import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { ITransactionAttributes } from '../interfaces';

export type TTransactionCreate = Omit<ITransactionAttributes, 'id'>;

export type TTransactionRes = IApiResponse<ITransactionAttributes | null>;

export type TTransactionListRes = IApiResponse<ITransactionAttributes[]>;

export type TTransactionListPaginationRes = IPaginationApiResponse<ITransactionAttributes>;
