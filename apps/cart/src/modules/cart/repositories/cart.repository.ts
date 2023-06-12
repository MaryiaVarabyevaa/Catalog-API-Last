import {Repository} from "typeorm";
import {Cart} from "./entities";

export class CartRepository extends Repository<Cart> {



    async addProductToCart(product: any) {
        const newProduct = this.create(product);
        return await this.save(newProduct);
    }

    async getCurrentCart(user_id: number) {
        const currentCart = await this.find({ where: { user_id } });
        return currentCart;
    }

    async clearCart(user_id) {

    }
}