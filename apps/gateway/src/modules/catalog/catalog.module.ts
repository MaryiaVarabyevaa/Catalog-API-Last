import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RmqModule } from '@app/common';
import { CATALOG_REQUEST_SERVICE, CATALOG_SERVICE } from './constants';
import { CatalogService } from './catalog.service';
import { CatalogResolver } from './catalog.resolver';

@Module({
  imports: [
    RmqModule.register({
      name: CATALOG_REQUEST_SERVICE,
    }),
    RmqModule.register({
      name: CATALOG_SERVICE,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  providers: [CatalogService, CatalogResolver],
})
export class CatalogModule {}
