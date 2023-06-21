import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, Details } from './entities';
import {
  ClearCartData,
  CreateProductData,
  GetCurrentCartData,
  UpdateProductData,
} from './types';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Details)
    private detailsRepository: Repository<Details>,
  ) {}

  async addProductToCart(product: CreateProductData) {
    await this.dataSource.transaction(async (manager) => {
      const isExistedProductId = await this.checkRecordExists(
        product.userId,
        product.productId,
      );

      if (isExistedProductId) {
        await this.updateCart({ id: isExistedProductId, ...product });
        return true;
      }

      const newProduct = new Cart();
      newProduct.user_id = product.userId;
      newProduct.currency = product.currency;

      const savedProduct = await manager.save(newProduct);

      const details = new Details();
      details.cart_id = savedProduct.id;
      details.product_id = product.productId;
      details.quantity = product.quantity;
      details.price = product.price;

      const savedDetails = await manager.save(details);

      return true;
    });
  }

  async updateCart(product: UpdateProductData) {
    await this.dataSource.transaction(async (manager) => {
      const { id } = await this.checkRecordExists(
        product.userId,
        product.productId,
      );

      const existedProduct = await manager.findOne(Cart, {
        where: { id },
      });

      existedProduct.currency = product.currency;
      const updatedProduct = await manager.save(existedProduct);

        const details = await manager.findOne(Details, {
          where: {
            product_id: product.productId,
            cart_id: id,
          },
        });

        details.quantity = product.quantity;
        const updatedDetails = await manager.save(details);
    });
  }

  async clearCart({ userId }: ClearCartData) {
    await this.dataSource.transaction(async (manager) => {

      const cart = await manager.findOne(Cart, {
          where: { user_id: userId },
        });

        if (cart) {
          throw new RpcException('');
        }

        const details = await manager.findOne(Details, {
          where: { cart_id: cart.id },
        });

        if (!details) {
          throw new RpcException('');
        }

      await manager.remove(Details, { cart_id: cart.id });
      await manager.remove(Cart, { id: cart.id });

    });
  }

  async getCurrentCart({ userId }: GetCurrentCartData) {
    const cart = await this.cartRepository.findOne({
      where: {
        user_id: userId,
      },
      relations: {
        details: true,
      },
    });

    return cart;
  }

  private async checkRecordExists(
    userId: number,
    productId: number,
  ): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new RpcException('');
    }

    const details = await this.detailsRepository.findOne({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (!details) {
      throw new RpcException('');
    }

    return cart.id;
  }
}
