import { UpdateCatalogState } from './update-catalog.state';
import { Product } from '../entities';
import { DeleteProductData } from '../types';
import { ErrorMessages } from '../constants';
import { winstonLoggerConfig } from '@app/common';

export class UpdateCatalogSagaStateDeleted extends UpdateCatalogState {
  async makeOperation(): Promise<void> {
    const { id } = this.saga.data as DeleteProductData;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingProduct = await queryRunner.manager.findOne(Product, {
        where: { id },
      });

      if (!existingProduct) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      await queryRunner.manager.softRemove(Product, existingProduct);
      await this.saga.sendMessageHelper.deleteProduct({ id });

      await queryRunner.commitTransaction();

      winstonLoggerConfig.info(`Product with id ${id} deleted`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.saga.sendMessageHelper.rollbackDeleteProduct({ id });

      winstonLoggerConfig.error(
        `Failed to delete product with id ${id}: ${err.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
