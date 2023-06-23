import { UpdateCatalogState } from './update-catalog.state';
import { Product } from '../entities';
import { UpdateQuantityData } from '../types';
import { ErrorMessages } from '../constants';

export class UpdateCatalogSagaStateUpdatedQuantity extends UpdateCatalogState {
  async makeOperation(): Promise<Product> {
    const data = this.saga.data as UpdateQuantityData[];
    let productId: number;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      data.map(async ({ id, rightQuantity }) => {
        productId = id;
        const existingProduct = await queryRunner.manager.findOne(Product, {
          where: { id },
        });

        if (!existingProduct) {
          throw new Error(ErrorMessages.NOT_FOUND);
        }

        if (existingProduct.availableQuantity >= rightQuantity) {
          existingProduct.availableQuantity = rightQuantity;
        } else {
          throw new Error(ErrorMessages.BAD_REQUEST);
        }

        await queryRunner.manager.save(existingProduct);
      });

      await this.saga.sendMessageHelper.updateProductQuantity(data);

      await queryRunner.commitTransaction();
      await this.saga.sendMessageHelper.commitUpdatedQuantity(data);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.saga.sendMessageHelper.rollbackUpdatedQuantity(data);
    } finally {
      await queryRunner.release();
    }
  }

  // async makeOperation(): Promise<Product> {
  //   const { id, rightQuantity } = this.saga.data as UpdateQuantityData;
  //   const queryRunner = this.saga.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const existingProduct = await queryRunner.manager.findOne(Product, {
  //       where: { id },
  //     });
  //
  //     if (!existingProduct) {
  //       throw new Error(ErrorMessages.NOT_FOUND);
  //     }
  //
  //     if (existingProduct.availableQuantity >= rightQuantity) {
  //       existingProduct.availableQuantity = rightQuantity;
  //     } else {
  //       throw new Error(ErrorMessages.BAD_REQUEST);
  //     }
  //
  //     const updatedProduct = await queryRunner.manager.save(existingProduct);
  //
  //     await this.saga.sendMessageHelper.updateProductQuantity({
  //       id,
  //       rightQuantity,
  //     });
  //
  //     await queryRunner.commitTransaction();
  //     await this.saga.sendMessageHelper.commitProduct({ id });
  //
  //     return updatedProduct;
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     await this.saga.sendMessageHelper.rollbackProduct({ id });
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
