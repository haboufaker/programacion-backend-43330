import { Router } from "express";
import { getProducts, getProductsById, addProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

// Route creation
const productsRouter = Router();

// return products GET method
productsRouter.get('/', getProducts);

// return products by id GET method
productsRouter.get('/:pid', getProductsById);

// Add new product POST method
productsRouter.post('/', isAdmin, addProduct);

// update product PUT method
productsRouter.put('/:pid', isAdmin, updateProduct);

// Delete product DELETE method
productsRouter.delete('/:pid', isAdmin, deleteProduct);


// Route export
export { productsRouter }