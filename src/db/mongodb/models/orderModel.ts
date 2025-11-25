/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model, Types, UpdateQuery } from 'mongoose';
import { IOrderDocument, IOrderItem } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import {
  AUTH_TOKEN_EXPIRATION_IN_MINUTES,
  MONGOOSE_MODEL,
  ORDER_STATUS,
  ORDER_TYPE,
  PRODUCT_ERROR_MESSAGES,
  STORE_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
} from '../../../constants';
import { addMinutes } from 'date-fns';
import { ProductModel } from './productModel';
import { StoreModel, UserModel } from '../../postgreSql';

const OrderItemSchema = {
  productId: {
    type: Types.ObjectId,
    ref: MONGOOSE_MODEL.PRODUCTS,
    validate: {
      validator: async function (value: string) {
        if (!value) return true;
        const exists = await ProductModel.countDocuments({ id: value });
        return !!exists;
      },
      message: PRODUCT_ERROR_MESSAGES.NOT_FOUND,
    },
    required: false,
  },
  title: {
    type: String,
    required: true,
    trim: false,
  },
  enTitle: {
    type: String,
    required: true,
    trim: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  payableAmount: {
    type: Number,
    required: true,
  },
  totalUnit: {
    type: Number,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  amountStr: {
    type: String,
    default: '0',
  },
  payableAmountStr: {
    type: String,
    default: '0',
  },
  totalUnitStr: {
    type: String,
    default: '0',
  },
  pricePerUnitStr: {
    type: String,
    default: '0',
  },
};

export const OrderSchema = new Schema<IOrderDocument>(
  {
    number: {
      type: String,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    payableAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    amountStr: {
      type: String,
      default: '0',
    },
    payableAmountStr: {
      type: String,
      default: '0',
    },
    paidAmountStr: {
      type: String,
      default: '0',
    },
    userId: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: async function (value: string) {
          if (!value) return true;
          const exists = await UserModel.count({ where: { id: value } });
          return !!exists;
        },
        message: USER_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    storeId: {
      type: String,
      required: false,
      validate: {
        validator: async function (value: string) {
          if (!value) return true;
          const exists = await StoreModel.count({ where: { id: value } });
          return !!exists;
        },
        message: STORE_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    additionalDetails: {
      type: [String],
      default: [],
    },
    expiredAt: {
      type: Date,
      required: true,
      default: addMinutes(new Date(), AUTH_TOKEN_EXPIRATION_IN_MINUTES.ORDER_TOKEN),
      index: { expireAfterSeconds: 0 },
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: true,
      default: ORDER_STATUS.PENDING,
    },
    type: {
      type: String,
      enum: Object.values(ORDER_TYPE),
      required: true,
    },
    referenceId: {
      type: Types.ObjectId,
      required: false,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const applyOrderDataTransformations = (target: any) => {
  // Sync number ↔ string fields
  if (target.amount !== undefined) target.amountStr = target.amount.toString();
  if (target.payableAmount !== undefined) target.payableAmountStr = target.payableAmount.toString();
  if (target.paidAmount !== undefined) target.paidAmountStr = target.paidAmount.toString();

  // Process items array
  if (Array.isArray(target.items)) {
    target.items = target.items.map((item: IOrderItem) => ({
      ...item,
      amountStr: item.amount?.toString() || '0',
      payableAmountStr: item.payableAmount?.toString() || '0',
      totalUnitStr: item.totalUnit?.toString() || '0',
      pricePerUnitStr: item.pricePerUnit?.toString() || '0',
    }));
  }

  // Handle expiration date
  if (target.status && target.status !== ORDER_STATUS.PENDING) {
    // remove expiredAt field (document-level will set undefined)
    target.expiredAt = null;
  }

  return target;
};

OrderSchema.pre('save', function (next) {
  applyOrderDataTransformations(this);
  next();
});

OrderSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function (next) {
  const setObj = (this.getUpdate() || {}) as UpdateQuery<IOrderDocument>;
  applyOrderDataTransformations(setObj);
  this.setUpdate(setObj);
  next();
});

export const OrderModel = model<IOrderDocument>(MONGOOSE_MODEL.ORDERS, OrderSchema);
