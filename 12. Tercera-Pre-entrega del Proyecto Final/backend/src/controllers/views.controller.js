import productService from "../services/product.service.js";
import cartService from '../services/cart.service.js';

export const realTimeProducts = async (req, res) => {
	try {
		let products = await productService.getProducts();
		res.render('realTimeProducts', {products});
	} catch {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const chat = async (req, res) => {
	try {
		res.render('chat', {})
	} catch {
		res.status(500).send({Error: "Internal server error"});
	}
}

export const products = async (req, res) => {
	try {
		const { user } = req.session;
		delete user.password;
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
			showAddToCartButton: true,
			user,
		});
	} catch(err) {
		console.log(err)
		res.status(500).send({Error: "Internal server error"});
	}
};

export const getCarts = async (req, res) => {
	try {
		const {user} = req.session;
		delete user.password;
		const cid = req.params.cid;
		const cart = await cartService.findById(cid);
		const cartData = {
		  products: cart.products.map(item => {
			return {
			  product: item.product.toObject(),
			  quantity: item.quantity,
			  title: item.product.title
			};
		  })
		};
		res.render('carts', {
			cart: cartData,
			user,
		});
	} catch(err) {
		console.log(err)
	  res.status(500).send({ Error: "Internal server error" });
	}
};