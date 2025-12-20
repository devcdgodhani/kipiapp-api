import { Schema, model } from 'mongoose';
import { IWhatsAppSessionDocument } from '../../../interfaces/whatsAppSession';
import { defaultAttributes } from '../plugins/baseSchema';
import { MONGOOSE_MODEL } from '../../../constants';
import { WHATSAPP_STATUS, WHATSAPP_TYPE } from '../../../constants';
import { getUniqUuid } from '../../../helpers';

export const WhatsAppSessionSchema = new Schema<IWhatsAppSessionDocument>(
  {
    clientId: {
      type: String,
      required: true,
      trim: true,
      default: getUniqUuid(),
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(WHATSAPP_STATUS),
      default: WHATSAPP_STATUS.STARTING,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
    },

    type: {
      type: String,
      required: false,
      enum: Object.values(WHATSAPP_TYPE),
      default: WHATSAPP_TYPE.SYSTEM,
    },

    userId: {
      type: String,
      required: true,
    },

    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

WhatsAppSessionSchema.index({ userId: 1 });
WhatsAppSessionSchema.index({ clientId: 1 });

export const WhatsAppSessionModel = model<IWhatsAppSessionDocument>(
  MONGOOSE_MODEL.WHATSAPP_SESSIONS,
  WhatsAppSessionSchema
);
