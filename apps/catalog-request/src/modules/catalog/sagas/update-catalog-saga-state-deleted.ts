import { UpdateCatalogState } from './update-catalog.state';
import { Product } from '../entities';
import { DeleteProductData } from '../types';
import { ErrorMessages } from '../constants';

export class UpdateCatalogSagaStateDeleted extends UpdateCatalogState {
  async makeOperation(): Promise<Product> {
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
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.saga.sendMessageHelper.rollbackDeleteProduct({ id });
    } finally {
      await queryRunner.release();
    }
  }
}
