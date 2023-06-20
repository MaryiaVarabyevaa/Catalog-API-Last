import {UpdateCatalogState} from "./update-catalog.state";
import {Product} from "../entities";

export class UpdateCatalogSagaStateUpdated extends UpdateCatalogState {
    makeOperation(): Promise<Product> {
        return Promise.resolve(undefined);
    }

}