export enum USER_ERROR_MESSAGES {
  CREATE_FAIL = 'Unable to create user!',
  GET_FAIL = 'Unable to retrieve user details!',
  UPDATE_FAIL = 'Unable to update user details!',
  DELETE_FAIL = 'Unable to delete user details!',
  NOT_FOUND = 'Unable to find user details!',
  EXIST = 'User is already exist!',
}

export enum AUTH_ERROR_MESSAGES {
  ACCOUNT_EXIST = 'User account already exist!',
  ACCOUNT_CREATE_FAILED = 'Unable to create account!',
  INVALID_TOKEN = 'Invalid token!',
  EXPIRED_TOKEN = 'Token expired!',
  TOKEN_NOT_FOUND = 'Token not found!',
  EMAIL_VERIFICATION_PENDING = 'Your email verification is pending!',
  MOBILE_VERIFICATION_PENDING = 'Your mobile verification is pending!',
  INVALID_VERIFICATION_OTP = 'Otp is invalid or expired!',
  OLD_PASSWORD_SAME = 'New password can not be the same as old password!',
  INVALID_USERNAME = 'Invalid username!',
  INVALID_PASSWORD = 'Invalid password!',
  PENDING_ACCOUNT_VERIFICATION = 'Account Verification is pending!',
}

export enum OTP_ERROR_MESSAGES {
  INVALID_OTP = 'Invalid otp!',
}

export enum CATEGORY_ERROR_MESSAGES {
  CREATE_FAIL = 'Unable to create category!',
  GET_FAIL = 'Unable to retrieve category details!',
  UPDATE_FAIL = 'Unable to update category details!',
  DELETE_FAIL = 'Unable to delete category details!',
  NOT_FOUND = 'Unable to find category details!',
  EXIST = 'Category is already exist!',
}

export enum SUB_CATEGORY_ERROR_MESSAGES {
  CREATE_FAIL = 'Unable to create sub category!',
  GET_FAIL = 'Unable to retrieve sub category details!',
  UPDATE_FAIL = 'Unable to update sub category details!',
  DELETE_FAIL = 'Unable to delete sub category details!',
  NOT_FOUND = 'Unable to find sub category details!',
  EXIST = 'Sub category is already exist!',
}

export enum PRODUCT_LOT_ERROR_MESSAGES {
  CREATE_FAIL = 'Unable to create product lot!',
  GET_FAIL = 'Unable to retrieve product lot details!',
  UPDATE_FAIL = 'Unable to update product lot details!',
  DELETE_FAIL = 'Unable to delete product lot details!',
  NOT_FOUND = 'Unable to find product lot details!',
  EXIST = 'Product lot is already exist!',
}

export enum STORE_ERROR_MESSAGES {
  CREATE_FAIL = 'Unable to create store!',
  GET_FAIL = 'Unable to retrieve store details!',
  UPDATE_FAIL = 'Unable to update store details!',
  DELETE_FAIL = 'Unable to delete store details!',
  NOT_FOUND = 'Unable to find store details!',
  EXIST = 'Store is already exist!',
}

export enum PRODUCT_ERROR_MESSAGES {
  CREATE_FAIL = 'Unable to create product!',
  GET_FAIL = 'Unable to retrieve product details!',
  UPDATE_FAIL = 'Unable to update product details!',
  DELETE_FAIL = 'Unable to delete product details!',
  NOT_FOUND = 'Unable to find product details!',
  EXIST = 'Product is already exist!',
}

export enum PRODUCT_SPECIFICATION_ERROR_MESSAGES {
  CREATE_FAIL = 'Unable to create product specification!',
  GET_FAIL = 'Unable to retrieve product specification details!',
  UPDATE_FAIL = 'Unable to update product specification details!',
  DELETE_FAIL = 'Unable to delete product specification details!',
  NOT_FOUND = 'Unable to find product specification details!',
  EXIST = 'Product specification is already exist!',
}