import {UpdateCatalogState} from './update-catalog.state';
import {Product} from '../entities';
import {CreateProductData} from "../types";

export class UpdateCatalogSagaStateCreated extends UpdateCatalogState {

  async makeOperation(): Promise<Product> {
    let product: Product;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const productInfo = this.saga.data as CreateProductData;

      const newProduct = new Product();
      newProduct.name = productInfo.name;
      newProduct.description = productInfo.description;
      newProduct.img_url = productInfo.img_url;
      newProduct.price = productInfo.price;
      newProduct.currency = productInfo.currency;
      newProduct.totalQuantity = productInfo.totalQuantity;
      newProduct.availableQuantity = productInfo.totalQuantity;

      product = await this.saga.sendMessageHelper.createProduct(productInfo);

      const savedProduct = await queryRunner.manager.save(newProduct);

      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.saga.sendMessageHelper.rollbackDeleteProduct({ id: product.id });
    } finally {
      await queryRunner.release();
    }
  }
}
