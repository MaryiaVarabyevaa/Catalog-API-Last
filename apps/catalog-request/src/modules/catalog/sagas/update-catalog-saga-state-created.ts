import {UpdateCatalogState} from "./update-catalog.state";
import {CreateProductData} from "../types";
import {Pattern} from "../constants";
import {Product} from "../entities";

export class UpdateCatalogSagaStateCreated extends UpdateCatalogState{

    async makeOperation(): Promise<Product> {

        return this.saga.transactionHelper.runInTransaction(async () => {

            const productInfo = this.saga.data as CreateProductData;

            const newProduct = await this.saga.productRepository.create({
                ...productInfo,
                availableQuantity: productInfo.totalQuantity
            });

            await this.saga.rmqService.send({ cmd: Pattern.PRODUCT_CREATED }, { data: productInfo }).toPromise();

            const savedProduct = await this.saga.productRepository.save(newProduct);

            return savedProduct;
        })

    }

}