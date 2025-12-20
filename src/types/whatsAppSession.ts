import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IWhatsAppSessionAttributes } from '../interfaces';

export type TWhatsAppSessionRes = IApiResponse<IWhatsAppSessionAttributes | null>;

export type TWhatsAppSessionListRes = IApiResponse<IWhatsAppSessionAttributes[]>;

export type TWhatsAppSessionListPaginationRes = IPaginationApiResponse<IWhatsAppSessionAttributes>;