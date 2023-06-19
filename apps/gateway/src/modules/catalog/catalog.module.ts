import {Module} from '@nestjs/common';
import {CatalogService} from './catalog.service';
import {CatalogResolver} from './catalog.resolver';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver} from '@nestjs/apollo';
import {RmqModule} from '@app/common';
import {CATALOG_REQUEST_SERVICE} from './constants';

@Module({
  imports: [
    RmqModule.register({
      // name: CATALOG_SERVICE,
      name: CATALOG_REQUEST_SERVICE
    }),
    GraphQLModule.forRoot({
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
