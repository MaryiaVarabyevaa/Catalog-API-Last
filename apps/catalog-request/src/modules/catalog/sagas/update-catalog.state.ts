import {UpdateCatalogSaga} from './update-catalog.saga';

export abstract class UpdateCatalogState {
  public saga: UpdateCatalogSaga;

  public setContext(saga: UpdateCatalogSaga) {
    this.saga = saga;
  }

  public abstract makeOperation();
}
