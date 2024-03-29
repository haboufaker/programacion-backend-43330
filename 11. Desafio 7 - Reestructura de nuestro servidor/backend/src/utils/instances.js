import ProductsController from '../controllers/products.controller.js';
import CartController from '../controllers/carts.controller.js';

export const productsController = new ProductsController('./products.json');
export const cartController = new CartController('./carts.json');