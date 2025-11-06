export enum MONGOOSE_MODEL {
  AUTH_ACTION_HISTORIES = 'auth_action_histories',
  AUTH_SETTINGS = 'auth_settings',
  AUTH_TOKENS = 'auth_tokens',
  CATEGORIES = 'categories',
  OTPS = 'otps',
  PRODUCT_LOTS = 'product_lots',
  PRODUCTS = 'products',
  PRODUCT_SPECIFICATIONS = 'product_specifications',
  STORES = 'stores',
  SUB_CATEGORIES = 'sub_categories',
  USERS = 'users',
  CONTACT_ADDRESSES = 'contact_addresses',
}

const POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS = {
  CREATED_BY: 'createdBy',
  UPDATED_BY: 'updatedBy',
  DELETED_BY: 'deletedBy',
};

export const POSTGRE_SQL_MODEL = {
  USERS: {
    TABLE_NAME: 'users',
    MODEL_NAME: 'UserModel',
    ASSOCIATIONS: {
      ...POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS,
      USER_ACTION_LIST: 'actionList',
      USER_TOKEN_LIST: 'tokenList',
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
    TABLE_NAME: 'auth_action_histories',
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
    },
  },
  STORES: {
    TABLE_NAME: 'stores',
    MODEL_NAME: 'StoreModel',
    ASSOCIATIONS: {
      ...POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS,
      CATEGORY_LIST: 'categoryList',
    },
  },
};
