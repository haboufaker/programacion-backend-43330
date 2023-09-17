import { Router } from "express";
import { getProducts, getProductsById, addProduct, updateProduct, deleteProduct, mockingProducts, deleteAll, uploadProductImage } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multerConfig.js";

// Route creation
const productsRouter = Router();


productsRouter.get('/mockingproducts', mockingProducts);

productsRouter.get('/mockingproducts/deleteAll', deleteAll);

// return products GET method
productsRouter.get('/', getProducts);

// return products by id GET method
productsRouter.get('/:pid', getProductsById);

// Add new product POST method
productsRouter.post('/', addProduct);

// update product PUT method
productsRouter.put('/:pid', updateProduct);

// Delete product DELETE method
productsRouter.delete('/:pid', deleteProduct);

productsRouter.post('/uploadProductImage/:pid', upload.single('productImage'), uploadProductImage);


// Route export
export { productsRouter }