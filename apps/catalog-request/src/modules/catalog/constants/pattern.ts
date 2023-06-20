export enum Pattern {
  CREATE_PRODUCT = 'create-product',
  UPDATE_PRODUCT = 'update-product',
  DELETE_PRODUCT = 'delete-product',

  PRODUCT_CREATED = 'product-created',
  PRODUCT_UPDATED = 'product-updated',
  PRODUCT_DELETED = 'product-deleted',
  PRODUCT_QUANTITY_CHANGED = 'product-quantity-changed',

  ROLLBACK_DELETE_NEW_PRODUCT = 'rollback-delete-new-product',
  ROLLBACK_PRODUCT = 'rollback-product',
  ROLLBACK_DELETE_PRODUCT = 'rollback-delete-product',

  COMMIT_PRODUCT = 'commit-update-product',
}
