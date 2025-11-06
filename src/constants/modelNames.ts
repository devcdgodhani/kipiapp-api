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
    },
  },
};
