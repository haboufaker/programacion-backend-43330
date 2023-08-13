import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

class CartDAO {

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
            const existingCart = await this.model.findById(id).populate('products.product')
        
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

            const product = await productModel.findById(productId);

            if (!product) {
                throw new Error(`Product not found for ID: ${productId}`);
            }

            const cart = await this.model.findById(cartId).populate({
                path: 'products.product',
                model: 'products'
            });

            if (!cart) {
                throw new Error(`Cart not found for ID: ${cartId}`);
            }

            const existingProduct = cart.products.find(p => p.product._id.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({
                    product: product._id,
                    quantity: 1
                });
            }

            await cart.save();

            return existingCartProducts;

        } catch (err) {
            console.error(err);
            return 404;
        }
    };

    async findById(cartId) {
        const cart = await this.model.findById(cartId).populate('products.product');
        return cart
    }

    async findByIdAndUpdate(id) {
        const cart = this.model.findByIdAndUpdate(id, { products: [] }, { new: true });
        return cart;
    }
    
    async updateOne(id, cart) {
        const result = await this.model.updateOne({_id: id}, cart);
        return result;
    }
};

const cartDAO = new CartDAO();


export default cartDAO