import { CallbackError, HydratedDocument, Schema, model } from 'mongoose';
import { IProductDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { ProductSpecificationSchemaObject } from './productSpecificationModel';
import {
  API_BASE_URL,
  CATEGORY_ERROR_MESSAGES,
  MONGOOSE_MODEL,
  PRODUCT_COMMON_STATUS,
  PRODUCT_LOT_ERROR_MESSAGES,
  STORE_ERROR_MESSAGES,
  SUB_CATEGORY_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
  USER_TYPE,
} from '../../../constants';
import {
  CategoryModel,
  SubCategoryModel,
  StoreModel,
  UserModel,
  ProductLotModel,
} from '../../postgreSql';
import { Op } from 'sequelize';
import { generateQRWithUrl } from '../../../helpers';

export const ProductSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    enTitle: {
      type: String,
      required: false,
      trim: true,
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
    categoryId: {
      type: String,
      required: true,
      validate: {
        validator: async function (value: string) {
          if (!value) return true;
          const exists = await CategoryModel.count({ where: { id: value } });
          return !!exists;
        },
        message: CATEGORY_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    subCategoryId: {
      type: String,
      required: true,
      validate: {
        validator: async function (value: string) {
          if (!value) return true;
          const exists = await SubCategoryModel.count({ where: { id: value } });
          return !!exists;
        },
        message: SUB_CATEGORY_ERROR_MESSAGES.NOT_FOUND,
      },
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
    vendorId: {
      type: String,
      required: false,
      validate: {
        validator: async function (value: string) {
          if (!value) return true;
          const exists = await UserModel.count({ where: { id: value, type: USER_TYPE.VENDOR } });
          return !!exists;
        },
        message: USER_ERROR_MESSAGES.VENDOR_NOT_FOUND,
      },
    },
    lotId: {
      type: [String],
      required: false,
      default: [],
      validate: {
        validator: async function (value: string[]) {
          if (!value || !value.length) return true;
          const exists = await ProductLotModel.count({ where: { id: { [Op.in]: value } } });
          return !!exists;
        },
        message: PRODUCT_LOT_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    totalUnit: {
      type: Number,
      required: true,
      default: 0,
    },
    soldUnit: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    basePricePerUnit: {
      type: Number,
      required: true,
    },
    specifications: {
      type: [ProductSpecificationSchemaObject],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_COMMON_STATUS),
      required: true,
      default: PRODUCT_COMMON_STATUS.ACTIVE,
    },
    qrCode: {
      type: String,
      required: false,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProductSchema.pre('save', async function (next) {
  const doc = this as HydratedDocument<IProductDocument>;
  if (doc.isNew || doc.isModified('title')) {
    try {
      const url = `${API_BASE_URL}/open/product/getOne?id=${doc.id.toString()}`;
      doc.qrCode = await generateQRWithUrl(url);
    } catch (err) {
      return next(err as CallbackError);
    }
  }
  next();
});

export const ProductModel = model<IProductDocument>(MONGOOSE_MODEL.PRODUCTS, ProductSchema);
