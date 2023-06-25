import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {
  CreateProductInput,
  DeleteProductInput,
  FindProductByIdArgs,
  UpdateProductInput,
} from './dtos';
import { ProductEntity } from './entities/product.entity';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guargs';
import { AtGuard } from '../auth/guards';
import { UserRoles } from '../../common/constants';

@Resolver('Catalog')
@UseGuards(AtGuard, RolesGuard)
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Query(() => ProductEntity)
  async getProductById(
    @Args() findProductByIdArgs: FindProductByIdArgs,
  ): Promise<ProductEntity> {
    const res = await this.catalogService.findProductById(findProductByIdArgs);
    return res;
  }

  @Query(() => [ProductEntity])
  async findAllProducts(): Promise<ProductEntity[]> {
    const res = await this.catalogService.findAllProducts();
    return res;
  }

  @Mutation(() => ProductEntity)
  @Roles(UserRoles.ADMIN)
  async createProduct(
    @Args('createProduct') createProductInput: CreateProductInput,
  ): Promise<ProductEntity> {
    const res = await this.catalogService.createProduct(createProductInput);
    return res;
  }

  @Mutation(() => ProductEntity)
  @Roles(UserRoles.ADMIN)
  async updateProduct(
    @Args('updateProduct') updateProductInput: UpdateProductInput,
  ): Promise<ProductEntity> {
    const res = await this.catalogService.updateProduct(updateProductInput);
    return res;
  }

  @Mutation(() => Boolean)
  @Roles(UserRoles.ADMIN)
  async deleteProduct(
    @Args('deleteProduct') deleteProductInput: DeleteProductInput,
  ): Promise<boolean> {
    await this.catalogService.deleteProduct(deleteProductInput);
    return true;
  }
}
