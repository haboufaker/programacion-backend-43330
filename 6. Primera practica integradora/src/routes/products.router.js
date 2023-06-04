import { Router } from "express";
import { productsController} from "../utils/instances.js";
import productService from "../dao/service/product.service.js";

// Route creation
const productsRouter = Router();

// return products GET method
productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
		let allProducts = await productService.getProducts();

		if (!limit || (typeof Math.round(limit)) !== "number" || isNaN(Math.round(limit)) || Math.round(limit) < 0 || Math.round(limit) >= allProducts.length) {
			res.status(201).send({allProducts});
		} else {
			allProducts.splice(limit, allProducts.length)
			res.status(201).send({allProducts});
		}
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// return products by id GET method
productsRouter.get('/:pid', async (req, res) => {
    try {
		let id = req.params.pid
		let existingProduct = await productService.getProductById(id);
		if (existingProduct === null) {
			res.status(404).send({Error: "Not found"})
		} else {
			res.status(201).send({existingProduct});
		}
		return existingProduct
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// Add new product POST method
productsRouter.post('/', async (req, res) => {
    try {
		let product = req.body

		let newProduct = await productService.addProduct(product)
        if (newProduct === null) {
			res.status(400).send({Error: "Could not add product"})
        } else {
			res.status(201).send({Message: "Product added"})
		}
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// update product PUT method
productsRouter.put('/:pid', async (req, res) => {
    try {
		let id = req.params.pid
		let product = req.body;
        let existingProduct = await productService.updateProduct(id, product)

        if (existingProduct === 409) {
            res.status(409).send({Error: "Can't update object property, make sure the property exists, you are not trying to modify the product code with an existing one for another product or you are not trying to modify the object's ID"})
        } else {
			res.status(201).send({Message: "Product updated"})
		}
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// Delete product DELETE method
productsRouter.delete('/:pid', async (req, res) => {
    try {
		let id = req.params.pid
        let existingProduct = await productService.deleteProduct(id)

        if (existingProduct === 404) {
            res.status(404).send({Error: "Not found"})
        } else {
			res.status(201).send({Message: "Product deleted"})
		}
    } catch (err) {
		res.status(500).send({Message: "Internal server error"});
	}
});


// Route export
export { productsRouter };