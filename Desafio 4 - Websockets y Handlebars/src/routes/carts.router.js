import { Router } from "express";
import { productsController, cartController } from "../utils/instances.js";


// Route creation
const cartsRouter = Router();

// add cart POST method
cartsRouter.post('/', async (req, res) => {
    try {
        await cartController.addCart()

		res.status(201).send({Message: "Cart added"})
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// return cart products by id GET method
cartsRouter.get('/:cid', async (req, res) => {
    try {
		let id = Math.round(req.params.cid)
		let existingCartProducts = await cartController.getCartProductsById(id);

		if (existingCartProducts === false) {
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
        let cartId = Math.round(req.params.cid)
        let productId = Math.round(req.params.pid)

		let existingProduct = await productsController.getProductById(productId);
		console.log(existingProduct)
		if (existingProduct === false) {
			res.status(404).send({Error: "Not found"})
		} else {

			let existingCartProducts = await cartController.addProductById(cartId, productId);
			console.log(existingCartProducts)
			if (existingCartProducts === 404) {
				res.status(404).send({Error: "Not found"})
			} else if (existingCartProducts === 200) {
				res.status(200).send({Message: "Product added"})
			} else {
				res.status(201).send({Message: "Cart updated"})
			}
		}
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// Route export
export { cartsRouter };