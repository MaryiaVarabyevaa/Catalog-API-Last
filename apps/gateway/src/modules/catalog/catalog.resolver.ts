import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CatalogService } from './catalog.service';
import {
  CreateProductInput,
  DeleteProductInput,
  FindProductByIdArgs,
  UpdateProductInput,
} from './dtos';
import { ProductEntity } from './entities/product.entity';

@Resolver('Catalog')
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
  async createProduct(
    @Args('createProduct') createProductInput: CreateProductInput,
  ): Promise<ProductEntity> {
    const res = await this.catalogService.createProduct(createProductInput);
    return res;
  }

  @Mutation(() => ProductEntity)
  async updateProduct(
    @Args('updateProduct') updateProductInput: UpdateProductInput,
  ): Promise<ProductEntity> {
    const res = await this.catalogService.updateProduct(updateProductInput);
    return res;
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('deleteProduct') deleteProductInput: DeleteProductInput,
  ): Promise<boolean> {
    await this.catalogService.deleteProduct(deleteProductInput);
    return true;
  }
}
