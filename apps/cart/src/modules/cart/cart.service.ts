import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { winstonLoggerConfig } from '@app/common';
import { Cart, Details } from './entities';
import {
  ClearCartData,
  CreateProductData,
  GetCurrentCartData,
  GetCurrentCartToOrderData,
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async addProductToCart(product: CreateProductData): Promise<Cart> {
    winstonLoggerConfig.info(
      `Adding product to cart for user with id ${product.userId}`,
    );

    const { userId, newCart, ...rest } = product;
    let cartId: number;
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
      } else {
        const cart = await queryRunner.manager.findOne(Cart, {
          where: { user_id: userId },
        });
        cartId = cart.id;
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

      winstonLoggerConfig.info(
        `Product has been added to cart for user with id ${product.userId}`,
      );

      return newProductInCart;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateCart(product: UpdateProductData): Promise<Cart> {
    winstonLoggerConfig.info(
      `Updating cart for user with id ${product.userId}`,
    );

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
        },
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

      winstonLoggerConfig.info(
        `Cart has been updated for user with id ${product.userId}`,
      );

      return updatedProductInCart;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async clearCart({ cartId }: ClearCartData): Promise<void> {
    winstonLoggerConfig.info(`Clearing cart with id ${cartId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { id: cartId },
      });

      if (!cart) {
        throw new RpcException('');
      }

      await queryRunner.manager.softDelete(Details, { cart_id: cartId });
      await queryRunner.manager.softDelete(Cart, { id: cartId });

      await queryRunner.commitTransaction();

      winstonLoggerConfig.info(`Cart with id ${cartId} has been cleared`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getCurrentCart({ userId }: GetCurrentCartData): Promise<Cart> {
    winstonLoggerConfig.info(`Getting current cart for user with id ${userId}`);

    const cart = await this.cartRepository.findOne({
      where: {
        user_id: userId,
      },
      relations: {
        details: true,
      },
    });

    winstonLoggerConfig.info(
      `Current cart for user with id ${userId}: ${JSON.stringify(cart)}`,
    );

    return cart;
  }

  async getCurrentCartToOrder({
    cartId,
  }: GetCurrentCartToOrderData): Promise<Cart> {
    winstonLoggerConfig.info(`Getting current cart to order with id ${cartId}`);

    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
      relations: {
        details: true,
      },
    });

    await this.cacheManager.set(`${cartId}-cart`, JSON.stringify(cart));

    await this.clearCart({ cartId });

    winstonLoggerConfig.info(`Cart with id ${cartId} has been cleared`);

    return cart;
  }

  async commitGetCart({ cartId }: GetCurrentCartToOrderData): Promise<void> {
    winstonLoggerConfig.info(`Committing cart with id ${cartId}`);

    try {
      await this.cacheManager.del(`${cartId}-cart`);
    } catch (err) {
      winstonLoggerConfig.error(
        `Failed to delete cart with id ${cartId}: ${err.message}`,
      );

      return err;
    }

    winstonLoggerConfig.info(`Cart with id ${cartId} deleted`);
  }

  async rollbackGetCart({ cartId }: GetCurrentCartToOrderData): Promise<void> {
    winstonLoggerConfig.info(`Rolling back cart with id ${cartId}`);

    try {
      await this.cartRepository.restore(cartId);
      await this.detailsRepository.restore({ cart_id: cartId });
    } catch (err) {
      winstonLoggerConfig.error(
        `Failed to rollback cart with id ${cartId}: ${err.message}`,
      );

      throw err;
    }

    winstonLoggerConfig.info(`Cart with id ${cartId} rolled back`);
  }
}
