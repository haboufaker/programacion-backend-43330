import { Router } from "express";
import { addCart, getCartProducts, addProductToCart, deleteProductFromCart, updateCartProducts, updateProductQuantity, deleteAllCartProducts, purchase, mail } from "../controllers/carts.controller.js";
import { isUser } from "../middlewares/auth.middleware.js";

// Route creation
const cartsRouter = Router();

// add cart POST method
cartsRouter.post('/', addCart);

// return cart products by id GET method
cartsRouter.get('/:cid', getCartProducts);

// add product to cart POST method
cartsRouter.post('/:cid/products/:pid', isUser, addProductToCart);

//Delete product from cart DELETE method
cartsRouter.delete('/:cid/products/:pid', deleteProductFromCart);

// update cart products PUT method
cartsRouter.put('/:cid', updateCartProducts);

// Update product quantity in cart PUT method
cartsRouter.put('/:cid/products/:pid', updateProductQuantity);

// delete all cart products DELETE method
cartsRouter.delete('/:cid', deleteAllCartProducts);

cartsRouter.post('/:cid/purchase', purchase);

cartsRouter.get('/mail/:tid', mail);

// Route export
export { cartsRouter };