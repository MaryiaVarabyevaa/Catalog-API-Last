export enum Pattern {
  GET_CURRENT_CART_TO_ORDER = 'get-current-cart-to-order',
  COMMIT_GET_CART = 'commit-get-cart',
  ROLLBACK_GET_CART = 'rollback-get-cart',

  CHECK_PRODUCT_QUANTITY = 'check-product-quantity',
  COMMIT_PRODUCT_QUANTITY = 'commit-product-quantity',
  ROLLBACK_PRODUCT_QUANTITY = 'rollback-product-quantity',

  CREATE_ORDER = 'create-order',
  DELETE_ORDER = 'delete-order',
  PAY_ORDER = 'pay-order',
  GET_ALL_USER_ORDERS = 'get-all-user-orders',
  GET_LATEST_USER_ORDER = 'get-latest-user-order',
}
