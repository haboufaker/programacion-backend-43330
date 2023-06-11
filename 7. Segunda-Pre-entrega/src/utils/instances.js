import ProductsController from '../dao/controllers/products.controller.js';
import CartController from '../dao/controllers/carts.controller.js';

export const productsController = new ProductsController('./products.json');
export const cartController = new CartController('./carts.json');