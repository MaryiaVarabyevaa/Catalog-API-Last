export enum Pattern {
  CREATE_PRODUCT = 'create-product',
  UPDATE_PRODUCT = 'update-product',
  DELETE_PRODUCT = 'delete-product',

  PRODUCT_CREATED = 'product-created',
  PRODUCT_UPDATED = 'product-updated',
  PRODUCT_DELETED = 'product-deleted',

  ROLLBACK_DELETE_NEW_PRODUCT = 'rollback-delete-new-product',
  ROLLBACK_PRODUCT = 'rollback-product',
  ROLLBACK_DELETE_PRODUCT = 'rollback-delete-product',
  ROLLBACK_UPDATED_QUANTITY = 'rollback-updated-quantity',

  COMMIT_PRODUCT = 'commit-update-product',
  COMMIT_UPDATED_QUANTITY = 'commit-updated-quantity',

  CHECK_PRODUCT_QUANTITY = 'check-product-quantity',
  COMMIT_PRODUCT_QUANTITY = 'commit-product-quantity',
  ROLLBACK_PRODUCT_QUANTITY = 'rollback-product-quantity',
}
