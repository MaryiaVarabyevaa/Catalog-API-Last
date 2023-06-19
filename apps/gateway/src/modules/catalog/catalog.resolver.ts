import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CatalogService } from './catalog.service';
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductArgs,
  UpdateProductInput,
} from './dtos';
import { ProductEntity } from './entities/product.entity';

@Resolver('Catalog')
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Query(() => ProductEntity)
  async getProductById(@Args() getProductArgs: GetProductArgs) {
    const res = await this.catalogService.findProductById(getProductArgs);
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
  ) {
    const res = await this.catalogService.updateProduct(updateProductInput);
    return res;
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('deleteProduct') deleteProductInput: DeleteProductInput,
  ) {
    const res = await this.catalogService.deleteProduct(deleteProductInput);
    return res;
  }
}
