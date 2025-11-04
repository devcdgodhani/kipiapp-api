import { ObjectId } from 'mongoose';
import { OTP_TYPE, TOKEN_TYPE } from '../constants';

export type TMongoDbConfig = {
  connectionUrl: string;
  dbName: string;
};

export type TJwtAuthParams = {
  tokenType?: string;
  byPassStoreValidation?: boolean;
};

export type TGenerateTokenParams = {
  userId: ObjectId;
  tokenType: TOKEN_TYPE;
  expiredAt: number;
  referenceTokenId?: ObjectId | null;
  otpType?: OTP_TYPE;
};

type Join<K extends string, P extends string> = P extends '' ? K : `${K}.${P}`;
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type NestedPaths<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends ReadonlyArray<infer U>
    ? NestedPaths<U, Prev[D]>
    : T extends object
      ? {
          [K in keyof T & string]:
            | K
            | (T[K] extends ReadonlyArray<infer U>
                ? Join<K, NestedPaths<U, Prev[D]>>
                : T[K] extends object
                  ? Join<K, NestedPaths<T[K], Prev[D]>>
                  : never);
        }[keyof T & string]
      : never;

export type SearchField<T> = NestedPaths<T>;
