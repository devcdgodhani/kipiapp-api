import mongoose, { ConnectOptions } from 'mongoose';
import transformIdIdQueryPlugin from './plugins/transformIdInQueryPlugin';
import transformIdInResponsePlugin from './plugins/transformIdInResponsePlugin';
import { addDefaultAttributesPlugin } from './plugins/addDefaultAttributesPlugin';
import { TMongoDbConfig } from '../../types';

mongoose.plugin(transformIdIdQueryPlugin);
mongoose.plugin(transformIdInResponsePlugin);
mongoose.plugin(addDefaultAttributesPlugin);

export const connectMongoDb = async (config: TMongoDbConfig) => {
  try {
    await mongoose.connect(config.connectionUrl, {
      dbName: config.dbName,
    } as ConnectOptions);
  } catch (err) {
    console.log('error while connect mongoDb : ' + err);
    throw err;
  }
};

/****************** models import **********************/
export * from './models/authActionHistoryModel';
export * from './models/authSettingsModel';
export * from './models/authTokenModel';
export * from './models/otpModel';
export * from './models/categoryModel';
export * from './models/subCategoryModel';
export * from './models/productLotModel';
export * from './models/storeModel';
export * from './models/productModel';
export * from './models/productSpecificationModel';
export * from './models/contactAddressModel';
