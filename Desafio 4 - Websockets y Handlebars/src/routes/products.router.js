import { Router } from "express";
import { productsController} from "../utils/instances.js";

// Route creation
const productsRouter = Router();

// return products GET method
productsRouter.get('/', async (req, res) => {
    try {
        let limit = req.query.limit;
		let allProducts = await productsController.getProducts();

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
		let id = Math.round(req.params.pid)
		let existingProduct = await productsController.getProductById(id);
		if (existingProduct === false) {
			res.status(404).send({Error: "Not found"})
		} else {
			res.status(201).send({existingProduct});
		}
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// Add new product POST method
productsRouter.post('/', async (req, res) => {
    try {
		let product = req.body

		let newProduct = await productsController.addProduct(product.title, product.description, product.price, product.code, product.stock, product.thumbnail)
        if (newProduct === 400) {
			res.status(400).send({Error: "Bad request"})
		} else if (newProduct === 409) {
            res.status(409).send({Error: "The product code is already in the database; if you are trying to add a new product, please choose a different code."})
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
		let id = Math.round(req.params.pid)
		let product = req.body;
        let existingProduct = await productsController.updateProduct(id, product)

        if (existingProduct === -1) {
            res.status(404).send({Error: "Not found"})
        } else if (existingProduct === 409) {
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
		let id = Math.round(req.params.pid)
        let existingProduct = await productsController.deleteProduct(id)

        if (existingProduct === -1) {
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