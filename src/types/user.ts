import { Optional } from 'sequelize';
import { IApiResponse, IPaginationApiResponse } from '../interfaces';
import { IUserAttributes } from '../interfaces';

export type TUserCreationAttributes = Optional<IUserAttributes, 'id'>;

export type TUserRes = IApiResponse<IUserAttributes>;

export type TUserListRes = IApiResponse<IUserAttributes[]>;

export type TUserListPaginationRes = IPaginationApiResponse<IUserAttributes>;