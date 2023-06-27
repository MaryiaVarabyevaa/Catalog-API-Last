import { UpdateCatalogState } from './update-catalog.state';
import { Product } from '../entities';
import { UpdateProductData } from '../types';
import { ErrorMessages } from '../constants';
import { winstonLoggerConfig } from '@app/common';

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

      this.updateProduct(existingProduct, rest);

      await queryRunner.manager.save(existingProduct);

      const updatedProduct = await this.saga.sendMessageHelper.updateProduct({
        id,
        ...rest,
      });

      await this.saga.sendMessageHelper.commitProduct({ id });
      await queryRunner.commitTransaction();

      winstonLoggerConfig.info(`Product with id ${id} updated`);

      return updatedProduct;
    } catch (err) {
      await this.saga.sendMessageHelper.rollbackProduct({ id });
      await queryRunner.rollbackTransaction();

      winstonLoggerConfig.error(
        `Failed to update product with id ${id}: ${err.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  private updateProduct(
    product: Product,
    data: Pick<
      UpdateProductData,
      | 'name'
      | 'description'
      | 'currency'
      | 'img_url'
      | 'price'
      | 'totalQuantity'
    >,
  ) {
    product.name = data.name;
    product.description = data.description;
    product.img_url = data.img_url;
    product.price = data.price;
    product.currency = data.currency;
    product.totalQuantity = data.totalQuantity;
    product.availableQuantity = data.totalQuantity;
  }
}
