// models/contactAddress.model.ts
import { Schema, model } from 'mongoose';
import { IContactAddressDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { MONGOOSE_MODEL } from '../../../constants';
import {
  GEO_SOURCE,
  MOBILE_NUMBER_TYPE,
  ADDRESS_TYPE,
  CONTACT_ADDRESS_USER_TYPE,
} from '../../../constants';
import { getUniqUuid } from '../../../helpers';

const MobileNumberSchema = {
  countryCode: { type: String },
  type: { type: String, enum: Object.values(MOBILE_NUMBER_TYPE) },
  number: { type: String },
  extension: { type: String },
  isPrimary: { type: Boolean, default: false },
  notes: { type: String },
  uuid: { type: String, require: true, default: getUniqUuid() },
};

const CountryStateCitySchema = {
  countryCode: { type: String },
  name: { type: String },
  code: { type: String },
};

const GeoCoordinateSchema = {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number] },
  highPrecisionCoordinates: { type: [String] },
  altitude: { type: Number },
  accuracy: { type: Number },
  verticalAccuracy: { type: Number },
  heading: { type: Number },
  speed: { type: Number },
  timestamp: { type: Number },
  source: { type: String, enum: Object.values(GEO_SOURCE), default: GEO_SOURCE.UNKNOWN },
  label: { type: String },
  confidence: { type: Number },
};

const AddressSchema = {
  uuid: { type: String, require: true, default: getUniqUuid() },
  cityId: { type: String, require: true },
  stateId: { type: String, require: true },
  countryId: { type: String, require: true },
  line1: { type: String, require: true },
  line2: { type: String },
  postalCode: { type: String, require: true },
  city: { type: CountryStateCitySchema },
  state: { type: CountryStateCitySchema },
  country: { type: CountryStateCitySchema },
  type: { type: String, enum: Object.values(ADDRESS_TYPE), require: true },
  otherType: { type: String },
  mobileNumbers: { type: [MobileNumberSchema], default: [] },
  geoCoordinates: { type: GeoCoordinateSchema },
  metadata: { type: String },
  isPrimary: { type: Boolean, default: false },
};

export const ContactAddressSchema = new Schema<IContactAddressDocument>(
  {
    referenceId: { type: String, require: true },
    type: { type: String, enum: Object.values(CONTACT_ADDRESS_USER_TYPE), require: true },
    addresses: { type: [AddressSchema], default: [] },
    mobileNumbers: { type: [MobileNumberSchema], default: [] },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ContactAddressSchema.index({ 'addresses.geoCoordinates': '2dsphere' });

export const ContactAddressModel = model<IContactAddressDocument>(
  MONGOOSE_MODEL.CONTACT_ADDRESSES,
  ContactAddressSchema
);
