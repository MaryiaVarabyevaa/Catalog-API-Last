export enum Pattern {
  PRODUCT_CREATED = 'product-created',
  PRODUCT_UPDATED = 'product-updated',
  PRODUCT_DELETED = 'product-deleted',
  PRODUCT_QUANTITY_CHANGED = 'product-quantity-changed',

  FIND_PRODUCT_BY_ID = 'find-product-by-id',
  FIND_ALL_PRODUCTS = 'find-all-products',

  ROLLBACK_DELETE_NEW_PRODUCT = 'rollback-delete-new-product',
  ROLLBACK_PRODUCT = 'rollback-product',
  ROLLBACK_DELETE_PRODUCT = 'rollback-delete-product',

  COMMIT_PRODUCT = 'commit-update-product',
}
