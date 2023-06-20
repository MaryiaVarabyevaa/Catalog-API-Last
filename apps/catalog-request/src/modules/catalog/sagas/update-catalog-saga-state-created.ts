import { UpdateCatalogState } from './update-catalog.state';
import { Pattern } from '../constants';
import { Product } from '../entities';
import {CreateProductData} from "../../../../../catalog/src/modules/product/types";

export class UpdateCatalogSagaStateCreated extends UpdateCatalogState {
  // async makeOperation(): Promise<Product> {
  //   return this.saga.transactionHelper.runInTransaction(async () => {
  //     const productInfo = this.saga.data as CreateProductData;
  //
  //     const newProduct = await this.saga.productRepository.create({
  //       ...productInfo,
  //       availableQuantity: productInfo.totalQuantity,
  //     });
  //
  //     await this.saga.rmqService
  //       .send({ cmd: Pattern.PRODUCT_CREATED }, { data: productInfo })
  //       .toPromise();
  //
  //     // Random error
  //
  //     const savedProduct = await this.saga.productRepository.save(newProduct);
  //
  //     return savedProduct;
  //   });
  // }

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

      product = await this.saga.rmqService
        .send({ cmd: Pattern.PRODUCT_CREATED }, { data: productInfo })
        .toPromise();

      const savedProduct = await queryRunner.manager.save(newProduct);

      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.saga.rmqService
          .send({ cmd: Pattern.ROLLBACK_DELETE_PRODUCT }, { data: { id: product.id } })
          .toPromise();
    } finally {
      await queryRunner.release();
    }
  }
}
