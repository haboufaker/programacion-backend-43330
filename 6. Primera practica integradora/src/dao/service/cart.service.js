import { cartModel } from "../models/cart.model.js";

class CartService {

    constructor() {
        this.model = cartModel;
    };

	async addCart() {
        const cart = {
            products: [],
        }
        return await this.model.create(cart);
    };

    async getCarts() {
        return await this.model.find();
    };

    async getCartProductsById(id) {
        try {
            const existingCart = await this.model.findById(id)
        
            if (!existingCart) {
                throw new Error('No document found with the given ID.');
            }

            const cart = await this.model.findById(id)

            return cart.products
            

        } catch (err) {
            console.error(err);

            return null;
        }
   }

    async addProductById(cartId, productId) {
        try {
            let existingCartProducts = await this.getCartProductsById(cartId);
        
            if (existingCartProducts === null) {
              throw new Error('No document found with the given ID.');
            }
        
            await this.model.findOneAndUpdate(
              {
                _id: cartId,
                products: {
                  $elemMatch: {
                    product: productId
                  }
                }
              },
              { $inc: { "products.$.quantity": 1 } },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            );
        
            return existingCartProducts;

            } catch(err) {
            console.error(err)
            return 404;
        }
    };
};

const cartService = new CartService();


export default cartService