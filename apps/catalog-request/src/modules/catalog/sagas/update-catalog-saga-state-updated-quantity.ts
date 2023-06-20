import {UpdateCatalogState} from "./update-catalog.state";

export class UpdateCatalogSagaStateUpdatedQuantity extends UpdateCatalogState{
    makeOperation(): Promise<Product> {
        return Promise.resolve(undefined);
    }
}