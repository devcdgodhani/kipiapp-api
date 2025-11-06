import { Schema, Types, model } from 'mongoose';
import { IContactAddressDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { MONGOOSE_MODEL } from '../../../constants';

export const ContactAddressSchema = new Schema<IContactAddressDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    enTitle: {
      type: String,
      required: false,
      trim: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.USERS,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ContactAddressModel = model<IContactAddressDocument>(MONGOOSE_MODEL.CONTACT_ADDRESSES, ContactAddressSchema);
