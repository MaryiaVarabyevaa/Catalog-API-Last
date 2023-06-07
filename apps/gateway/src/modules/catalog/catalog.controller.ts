import {Body, Controller, Get} from '@nestjs/common';
import {CatalogService} from "./catalog.service";

@Controller('catalog')
export class CatalogController {

    constructor(
       private readonly catalogService: CatalogService
    ) {}

    @Get('/create')
    async addProduct(@Body() newUser: any): Promise<string> {
        await this.catalogService.addProduct();
        return 'addProduct';
    }

    @Get('/read')
    async getProducts(@Body() newUser: any): Promise<string> {
        await this.catalogService.getProducts();
        return 'addProduct';
    }
}
