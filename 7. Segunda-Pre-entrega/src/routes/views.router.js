import { Router } from 'express';
import { productsController } from "../utils/instances.js";
import productService from "../dao/service/product.service.js";
import { messageModel } from '../dao/models/message.model.js';
import { cartModel } from '../dao/models/cart.model.js';


// Router instance
const viewsRouter = Router();

// Home route definition
viewsRouter.get('/', async (req, res) => {
	// Render index view
	try {
		let products = await productService.getProducts();
		res.render('home', {products});
		console.log(products)
	} catch {
		res.status(500).send({Error: "Internal server error"});
	}
	
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
	try {
		let products = await productService.getProducts();
		res.render('realTimeProducts', {products});
	} catch {
		res.status(500).send({Error: "Internal server error"});
	}
});

viewsRouter.get('/chat', async (req, res) => {
	try {
		res.render('chat', {})
	} catch {
		res.status(500).send({Error: "Internal server error"});
	}
})

viewsRouter.get('/products', async (req, res) => {
	try {
        const limit = parseInt(req.query.limit) || undefined;
		const page = parseInt(req.query.page) || undefined;
		const category = req.query.category;
		const availability = req.query.availability;
		const sort = req.query.sort;

		const products = await productService.getProductsForView(sort, limit, page, category, availability);
		products.category = category;
		products.availability = availability;

		res.render('products', {
			docs: products.docs,
			hasPrevPage: products.hasPrevPage,
			prevPage: products.prevPage,
			hasNextPage: products.hasNextPage,
			nextPage: products.nextPage,
			limit: products.limit,
			page: products.page,
			category: category,
			availability: availability,
			showAddToCartButton: true
		});
	} catch {
		res.status(500).send({Error: "Internal server error"});
	}
});

viewsRouter.get('/carts/:cid', async (req, res) => {
	try {
		const cid = req.params.cid;
		const cart = await cartModel.findById(cid).populate('products.product');
		const cartData = {
		  products: cart.products.map(item => {
			return {
			  product: item.product.toObject(),
			  quantity: item.quantity,
			  title: item.product.title
			};
		  })
		};
		res.render('carts', { cart: cartData });
	} catch {
	  res.status(500).send({ Error: "Internal server error" });
	}
});
// Exportamos el router
export {viewsRouter}