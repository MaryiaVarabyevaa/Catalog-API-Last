import {UpdateCatalogSaga} from "./update-catalog.saga";
import {Product} from "../entities";

export abstract class UpdateCatalogState {
    public saga: UpdateCatalogSaga;


    public setContext(saga: UpdateCatalogSaga) {
        this.saga = saga;
    }

    public abstract makeOperation(): Promise<Product>;
}
