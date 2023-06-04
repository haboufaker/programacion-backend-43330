import { Router } from "express";
import { productsController, cartController } from "../utils/instances.js";
import cartService from "../dao/service/cart.service.js";
import productService from "../dao/service/product.service.js";


// Route creation
const cartsRouter = Router();

// add cart POST method
cartsRouter.post('/', async (req, res) => {
    try {
        await cartService.addCart()

		res.status(201).send({Message: "Cart added"})
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// return cart products by id GET method
cartsRouter.get('/:cid', async (req, res) => {
    try {
		let id = req.params.cid
		let existingCartProducts = await cartService.getCartProductsById(id);

		if (existingCartProducts === null) {
			res.status(404).send({Error: "Not found"})
		} else {
			res.status(201).send({existingCartProducts});
		}
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// add product to cart POST method
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        let cartId = req.params.cid
        let productId = Math.round(req.params.pid)

		let existingCartProducts = await cartService.addProductById(cartId, productId);
		console.log(existingCartProducts)
		if (existingCartProducts === 404) {
			res.status(404).send({Error: "Not found"})
		} else {
			res.status(201).send({Message: "Cart updated"})
		}
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// Route export
export { cartsRouter };