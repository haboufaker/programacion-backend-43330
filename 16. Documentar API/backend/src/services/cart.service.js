import cartDAO from "../dao/cart.dao.js";

class CartService {

    constructor() {
        this.model = cartDAO;
    };

	async addCart() {
        return await this.model.addCart();
    };

    async getCarts() {
        return await this.model.getCarts();
    };

    async getCartProductsById(id) {
        return await this.model.getCartProductsById(id);
   }

   async addProductById(cartId, productId) {
    return await this.model.addProductById(cartId, productId);
    };

    async findById(cartId) {
        return await this.model.findById(cartId);
    }

    async findByIdAndUpdate(id) {
        return await this.model.findByIdAndUpdate(id);
    }
    
    async updateOne(id, cart) {
        return await this.model.updateOne(id, cart);
    }
};

const cartService = new CartService();


export default cartService