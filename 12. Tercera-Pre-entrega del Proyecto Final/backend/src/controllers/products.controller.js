import productService from "../services/product.service.js";

export const getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || undefined;
		const page = parseInt(req.query.page) || undefined;
		const category = req.query.category;
		const availability = req.query.availability;
		const sort = req.query.sort;

		const products = await productService.getProductsForView(sort, limit, page, category, availability);
		products.category = category;
		products.availability = availability;

		const totalPages = products.totalPages;
		const prevPage = products.prevPage || null;
		const nextPage = products.nextPage || null;
		const currentPage = products.page;
		const hasPrevPage = products.hasPrevPage;
		const hasNextPage = products.hasNextPage;
		const prevLink = prevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&category=${category}&availability=${availability}` : null;
		const nextLink = nextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&category=${category}&availability=${availability}` : null;

		res.status(201).send({
			status: 'success',
			payload: products.docs,
			totalPages,
			prevPage,
			nextPage,
			page: currentPage,
			hasPrevPage,
			hasNextPage,
			prevLink,
			nextLink,
		});
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const getProductsById = async (req, res) => {
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
};

export const addProduct = async (req, res) => {
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
};

// update product PUT method
export const updateProduct = async (req, res) => {
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
};

export const deleteProduct =async (req, res) => {
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
};
