import { ObjectId } from 'mongoose';
import {
  GEO_SOURCE,
  MOBILE_NUMBER_TYPE,
  ADDRESS_TYPE,
  CONTACT_ADDRESS_USER_TYPE,
} from '../constants';
import { IDefaultAttributes } from './common';

export interface IGeoCoordinate {
  type: 'POINT';
  coordinates: [number, number];
  highPrecisionCoordinates: [string, string];
  altitude: number;
  accuracy: number;
  verticalAccuracy: number;
  heading: number;
  speed: number;
  timestamp: number;
  source: GEO_SOURCE;
  label: string;
  confidence: number;
}

export interface ICountryStateCity {
  name: string;
  code: string;
  countryCode: string;
}

export interface IMobileNumber {
  countryCode: string;
  type: MOBILE_NUMBER_TYPE;
  number: string;
  extension: string;
  isPrimary: boolean;
  notes: string;
  uuid: string;
}

export interface IAddress {
  uuid: string;
  cityId: string;
  stateId: string;
  countryId: string;
  line1: string;
  line2: string;
  postalCode: string;
  city: ICountryStateCity;
  state: ICountryStateCity;
  country: ICountryStateCity;
  type: ADDRESS_TYPE;
  otherType: string;
  mobileNumbers: IMobileNumber[];
  geoCoordinates: IGeoCoordinate;
  metadata: string;
  isPrimary: boolean;
}

export interface IContactAddressAttributes extends IDefaultAttributes {
  id: ObjectId;
  referenceId: string;
  type: CONTACT_ADDRESS_USER_TYPE;
  addresses: IAddress[];
  mobileNumbers: IMobileNumber[];
}

export interface IContactAddressDocument extends Omit<IContactAddressAttributes, 'id'>, Document {}
