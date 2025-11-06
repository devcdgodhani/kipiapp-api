import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IContactAddressAttributes } from '../interfaces';

export type TContactAddressRes = IApiResponse<IContactAddressAttributes | null>;

export type TContactAddressListRes = IApiResponse<IContactAddressAttributes[]>;

export type TContactAddressListPaginationRes = IPaginationApiResponse<IContactAddressAttributes>;