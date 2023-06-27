import { UpdateCatalogState } from './update-catalog.state';
import { Product } from '../entities';
import { UpdateQuantityData } from '../types';
import { ErrorMessages } from '../constants';
import { winstonLoggerConfig } from '@app/common';

export class UpdateCatalogSagaStateUpdatedQuantity extends UpdateCatalogState {
  async makeOperation(): Promise<void> {
    const { data, operation } = this.saga.data as UpdateQuantityData;
    let productId: number;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const { productId: id, rightQuantity } of data) {
        productId = id;
        const existingProduct = await queryRunner.manager.findOne(Product, {
          where: { id },
        });

        if (!existingProduct) {
          throw new Error(ErrorMessages.NOT_FOUND);
        }

        await this.saga.cacheManager.set(
          `${id}-product`,
          JSON.stringify(existingProduct),
        );

        if (operation === 'addition') {
          existingProduct.availableQuantity =
            existingProduct.availableQuantity + rightQuantity;
        } else {
          if (existingProduct.availableQuantity >= rightQuantity) {
            existingProduct.availableQuantity =
              existingProduct.availableQuantity - rightQuantity;
          } else {
            throw new Error(ErrorMessages.BAD_REQUEST);
          }
        }

        await queryRunner.manager.save(existingProduct);
      }

      await this.saga.sendMessageHelper.updateProductQuantity({
        data,
        operation,
      });

      await queryRunner.commitTransaction();

      winstonLoggerConfig.info(
        `Product quantity updated for product with id ${productId}`,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.saga.sendMessageHelper.rollbackUpdatedQuantity(data);

      winstonLoggerConfig.error(
        `Failed to update product quantity for product with id ${productId}: ${err.message}`,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
