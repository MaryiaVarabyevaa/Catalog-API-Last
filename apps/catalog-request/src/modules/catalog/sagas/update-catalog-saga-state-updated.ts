import { UpdateCatalogState } from './update-catalog.state';
import { Product } from '../entities';
import { UpdateProductData, UpdateQuantityData } from '../types';
import { ErrorMessages } from '../constants';

export class UpdateCatalogSagaStateUpdated extends UpdateCatalogState {
  async makeOperation(): Promise<Product> {
    const { id, ...rest } = this.saga.data as UpdateProductData;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingProduct = (await queryRunner.manager.findOne(Product, {
        where: { id },
      })) as Product;

      if (!existingProduct) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      existingProduct.name = rest.name;
      existingProduct.description = rest.description;
      existingProduct.img_url = rest.img_url;
      existingProduct.price = rest.price;
      existingProduct.currency = rest.currency;
      existingProduct.totalQuantity = rest.totalQuantity;
      existingProduct.availableQuantity = rest.totalQuantity;

      const updatedProduct = await queryRunner.manager.save(existingProduct);

      await this.saga.sendMessageHelper.updateProduct({ id, ...rest });

      await queryRunner.commitTransaction();
      await this.saga.sendMessageHelper.commitProduct({ id });

      return updatedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.saga.sendMessageHelper.rollbackProduct({ id });
    } finally {
      await queryRunner.release();
    }
  }
}
