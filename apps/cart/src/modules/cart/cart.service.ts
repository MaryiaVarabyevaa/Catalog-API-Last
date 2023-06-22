import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Cart, Details } from './entities';
import {
  ClearCartData,
  CreateProductData,
  GetCurrentCartData,
  UpdateProductData,
} from './types';

@Injectable()
export class CartService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Details)
    private detailsRepository: Repository<Details>,
  ) {}

  async addProductToCart(product: CreateProductData): Promise<Cart> {
    const { userId, newCart, id, ...rest } = product;
    let cartId = id;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (newCart) {
        const newProduct = new Cart();
        newProduct.user_id = userId;
        newProduct.currency = rest.currency;
        const savedProduct = await queryRunner.manager.save(newProduct);
        cartId = savedProduct.id;
      }

      const details = new Details();
      details.cart_id = cartId;
      details.product_id = rest.productId;
      details.quantity = rest.quantity;
      details.price = rest.price;

      await queryRunner.manager.save(details);

      await queryRunner.commitTransaction();

      const newProductInCart = await this.getCurrentCart({
        userId: product.userId,
      });
      return newProductInCart;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateCart(product: UpdateProductData): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isExistedCart = await queryRunner.manager.findOne(Cart, {
        where: { user_id: product.userId },
      });

      if (!isExistedCart) {
        throw new RpcException('');
      }

      const isExistedDetails = await queryRunner.manager.findOne(Details, {
        where: {
          cart_id: product.id,
          product_id: product.productId,
        }
      });


      if (!isExistedDetails) {
        throw new RpcException('');
      }

      isExistedCart.currency = product.currency;
      await queryRunner.manager.save(isExistedCart);


      isExistedDetails.quantity = product.quantity;
      await queryRunner.manager.save(isExistedDetails);

      await queryRunner.commitTransaction();

      const updatedProductInCart = await this.getCurrentCart({
        userId: product.userId,
      });
      return updatedProductInCart;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async clearCart({ userId }: ClearCartData): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user_id: userId },
      });

      if (!cart) {
        throw new RpcException('');
      }

      await queryRunner.manager.delete(Details, { cart_id: cart.id });
      await queryRunner.manager.delete(Cart, { id: cart.id });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getCurrentCart({ userId }: GetCurrentCartData): Promise<Cart> {
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
}
