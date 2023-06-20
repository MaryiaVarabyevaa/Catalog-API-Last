import {ClientProxy} from "@nestjs/microservices";
import {Repository} from "typeorm";
import {Data} from "../types";
import {OperationState} from "../constants";
import {UpdateCatalogState} from "./update-catalog.state";
import {UpdateCatalogSagaStateCreated} from "./update-catalog-saga-state-created";
import {UpdateCatalogSagaStateUpdated} from "./update-catalog-saga-state-updated";
import {UpdateCatalogSagaStateUpdatedQuantity} from "./update-catalog-saga-state-updated-quantity";
import {UpdateCatalogSagaStateDeleted} from "./update-catalog-saga-state-deleted";
import {TransactionHelper} from "../helpers";
import {Product} from "../entities";

export class UpdateCatalogSaga {

    private state: UpdateCatalogState;

    constructor(
        public state: OperationState,
        public data: Data,
        public rmqService: ClientProxy,
        public transactionHelper: TransactionHelper,
        public productRepository: Repository<Product>
    ) {
        this.setState(state);
    }

    setState(state: OperationState) {
        switch (state) {
            case OperationState.CREATED:
                this.state = new UpdateCatalogSagaStateCreated();
                break;
            case OperationState.UPDATED:
                this.state = new UpdateCatalogSagaStateUpdated();
                break;
            case OperationState.UPDATED_QUANTITY:
                this.state = new UpdateCatalogSagaStateUpdatedQuantity();
                break;
            case OperationState.DELETED:
                this.state = new UpdateCatalogSagaStateDeleted();
                break;
        }

        this.state.setContext(this);
    }

    getState() {
        return this.state;
    }
}