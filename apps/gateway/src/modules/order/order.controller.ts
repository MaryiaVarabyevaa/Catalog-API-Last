import {Body, Controller, Get} from '@nestjs/common';
import {OrderService} from "./order.service";

@Controller('order')
export class OrderController {

    constructor(
       private readonly orderService: OrderService
    ) {}

    @Get('/create')
    async addProduct(@Body() newUser: any): Promise<string> {
        await this.orderService.payOrder();
        return 'addProduct';
    }
}
