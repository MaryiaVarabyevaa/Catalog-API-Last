import {UpdateCatalogState} from "./update-catalog.state";
import {Product} from "../entities";

export class UpdateCatalogSagaStateDeleted extends UpdateCatalogState {
    makeOperation(): Promise<Product> {
        return Promise.resolve(undefined);
    }
}