import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities';
import {
  CreateProductData,
  Data,
  DeleteProductData,
  UpdateProductData,
  UpdateQuantityData,
} from './types';
import { CATALOG_SERVICE, ErrorMessages, Pattern } from './constants';
import {ProductEntity} from "../../../../gateway/src/modules/catalog/entities/product.entity";

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CATALOG_SERVICE) private catalogClient: ClientProxy,
    private dataSource: DataSource,
  ) {}

  async createProduct(createProductData: CreateProductData): Promise<Product> {
    return this.runInTransaction(async () => {
      const newProduct = await this.productRepository.create({
        ...createProductData,
        availableQuantity: createProductData.totalQuantity,
      });

      const savedProduct = await this.productRepository.save(newProduct);

      await this.sendMessage(Pattern.PRODUCT_CREATED, createProductData);

      return savedProduct;
    });
  }

  async updateProduct({ id, ...rest }: UpdateProductData): Promise<Product> {
    return this.runInTransaction(async () => {
      await this.checkProductExistence(id);

      await this.productRepository.update(id, {
        ...rest,
        availableQuantity: rest.totalQuantity,
      });

      const updatedProduct = await this.productRepository.findOne({
        where: { id },
      });

      await this.sendMessage(Pattern.PRODUCT_UPDATED, { id, ...rest });

      return updatedProduct;
    });
  }

  async deleteProduct({ id }: DeleteProductData): Promise<boolean> {
    return this.runInTransaction(async () => {
      await this.checkProductExistence(id);

      await this.productRepository.delete(id);
      await this.sendMessage(Pattern.PRODUCT_DELETED, { id });
      return true;
    });
  }

  async updateQuantity({
    id,
    rightQuantity,
  }: UpdateQuantityData): Promise<Product> {
    return this.runInTransaction(async () => {
      await this.checkProductExistence(id);

      const { availableQuantity } = await this.productRepository.findOne({
        where: { id },
      });

      if (availableQuantity >= rightQuantity) {
        await this.productRepository.update(id, {
          availableQuantity: availableQuantity - rightQuantity,
        });
      } else {
        throw new RpcException(ErrorMessages.BAD_REQUEST);
      }

      const product = await this.productRepository.findOne({ where: { id } });
      await this.sendMessage(Pattern.PRODUCT_QUANTITY_CHANGED, {
        id,
        rightQuantity,
      });

      return product;
    });
  }

  private async runInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation();

      await queryRunner.commitTransaction();

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async checkProductExistence(id: number): Promise<void> {
    const isExistedProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!isExistedProduct) {
      throw new RpcException(ErrorMessages.NOT_FOUND);
    }
  }

  private async sendMessage(
      msg: Pattern,
      data: Data,
  ): Promise<void> {
    const pattern = { cmd: msg };
    return await this.catalogClient.send(pattern, { data }).toPromise();
  }
}
