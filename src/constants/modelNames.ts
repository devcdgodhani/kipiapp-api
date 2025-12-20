export enum MONGOOSE_MODEL {
  PRODUCTS = 'products',
  PRODUCT_SPECIFICATIONS = 'product_specifications',
  CONTACT_ADDRESSES = 'contact_addresses',
  TRANSACTION = 'transactions',
  ORDERS = 'orders',
  WHATSAPP_SESSIONS = 'whatsapp_sessions',
}

export const POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS = {
  CREATED_BY: 'createdByUser',
  UPDATED_BY: 'updatedByUser',
  DELETED_BY: 'deletedByUser',
};

export const POSTGRE_SQL_MODEL = {
  USERS: {
    TABLE_NAME: 'users',
    MODEL_NAME: 'UserModel',
    ASSOCIATIONS: {
      ...POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS,
      USER_ACTION_LIST: 'actionList',
      USER_TOKEN_LIST: 'tokenList',
      OTP_LIST: 'otpList',
      STORE_LIST: 'userStoreList',
      PRODUCT_LOT_LIST: 'productLotList',
    },
  },
  AUTH_ACTION_HISTORIES: {
    TABLE_NAME: 'auth_action_histories',
    MODEL_NAME: 'AuthActionHistoryModel',
    ASSOCIATIONS: {
      ...POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS,
      USER: 'user',
    },
  },
  AUTH_TOKENS: {
    TABLE_NAME: 'auth_tokens',
    MODEL_NAME: 'AuthActionHistoryModel',
    ASSOCIATIONS: {
      ...POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS,
      USER: 'user',
      REFERENCE_TOKEN: 'referenceToken',
    },
  },
  CATEGORIES: {
    TABLE_NAME: 'categories',
    MODEL_NAME: 'CategoryModel',
    ASSOCIATIONS: {
      ...POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS,
      STORE: 'store',
      SUB_CATEGORY_LIST: 'subCategoryList',
    },
  },
  STORES: {
    TABLE_NAME: 'stores',
    MODEL_NAME: 'StoreModel',
    ASSOCIATIONS: {
      USER: 'user',
      CATEGORY_LIST: 'categoryList',
      SUB_CATEGORY_LIST: 'storeSubCategoryList',
      PRODUCT_LOT_LIST: 'productLotList',
    },
  },
  OTPS: {
    TABLE_NAME: 'otps',
    MODEL_NAME: 'OtpModel',
    ASSOCIATIONS: {
      USER: 'user',
    },
  },
  SUB_CATEGORIES: {
    TABLE_NAME: 'sub_categories',
    MODEL_NAME: 'SubCategoryModel',
    ASSOCIATIONS: {
      CATEGORY: 'category',
      STORE: 'store',
    },
  },
  PRODUCT_LOTS: {
    TABLE_NAME: 'product_lots',
    MODEL_NAME: 'ProductLotModel',
    ASSOCIATIONS: {
      STORE: 'store',
      PARENT_LOT: 'parentLot',
      CHILD_LOT_LIST: 'childLotList',
      VENDOR: 'vendor',
    },
  },
};
