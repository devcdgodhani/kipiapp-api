import { Schema, model, UpdateQuery } from 'mongoose';
import { ITransactionDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import {
  MONGOOSE_MODEL,
  STORE_ERROR_MESSAGES,
  TRANSACTION_ACTION,
  TRANSACTION_REFERENCE_MODULE,
} from '../../../constants';
import { StoreModel } from '../../postgreSql';

export const TransactionSchema = new Schema<ITransactionDocument>(
  {
    date: {
      type: Date,
      required: true,
    },

    referenceId: {
      type: String,
      required: false,
      trim: true,
    },

    referenceType: {
      type: String,
      required: false,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    amountStr: {
      type: String,
      default: '0',
    },

    action: {
      type: String,
      enum: Object.values(TRANSACTION_ACTION),
      required: true,
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    enDescription: {
      type: String,
      required: false,
      trim: true,
    },

    storeId: {
      type: String,
      required: true,
      validate: {
        validator: async function (value: string) {
          if (!value) return true;
          const exists = await StoreModel.count({ where: { id: value } });
          return !!exists;
        },
        message: STORE_ERROR_MESSAGES.NOT_FOUND,
      },
    },

    referenceModule: {
      type: String,
      enum: Object.values(TRANSACTION_REFERENCE_MODULE),
      default: TRANSACTION_REFERENCE_MODULE.OTHER,
      required: true,
    },

    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ----------------------------
    HOOKS 
----------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyTransactionTransformations = (target: any) => {
  if (target.amount !== undefined) target.amountStr = target.amount.toString();

  return target;
};
TransactionSchema.pre('save', function (next) {
  applyTransactionTransformations(this);
  next();
});

TransactionSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function (next) {
  const updateObj = (this.getUpdate() || {}) as UpdateQuery<ITransactionDocument>;
  applyTransactionTransformations(updateObj);
  this.setUpdate(updateObj);
  next();
});

export const TransactionModel = model<ITransactionDocument>(
  MONGOOSE_MODEL.TRANSACTION,
  TransactionSchema
);
