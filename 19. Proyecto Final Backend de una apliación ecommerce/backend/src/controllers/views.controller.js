import productService from "../services/product.service.js";
import cartService from '../services/cart.service.js';
import ProductRenderDTO from "../dto/productRender.dto.js";
import CartDataRenderDTO from "../dto/cartDataRender.dto.js";
import userService from "../services/user.service.js";

export const realTimeProducts = async (req, res) => {
	try {
		let products = await productService.getProducts();
		res.render('realTimeProducts', {products});
	} catch(err) {
		req.logger.fatal(err)
		res.status(500).send({Error: "Internal server error"});
	}
};

export const chat = async (req, res) => {
	try {
		res.render('chat', {})
	} catch(err) {
		req.logger.fatal(err)
		res.status(500).send({Error: "Internal server error"});
	}
}

export const products = async (req, res) => {
	try {
		const { user } = req.session;
		delete user.password;
		let profileImage;
		let profileImageUrl;

		if (user.role !== "admin") {
			profileImage = user.documents.findIndex(document => document.name === 'Profile image');
		}
		if (user.role !== "admin" && profileImage !== -1) {
			profileImageUrl = user.documents[profileImage].reference
		}

        const limit = parseInt(req.query.limit) || 10;
		const page = parseInt(req.query.page) || 1;
		const category = req.query.category;
		const availability = req.query.availability;
		const sort = req.query.sort;

		const products = await productService.getProductsForView(sort, limit, page, category, availability);
		products.category = category;
		products.availability = availability;

		const productRender = new ProductRenderDTO({
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
			profileImageUrl,
		})
		
		res.render('products', productRender );
	} catch(err) {
		req.logger.fatal(err)
		res.status(500).send({Error: "Internal server error"});
	}
};

export const getCarts = async (req, res) => {
	try {
		const {user} = req.session;
		delete user.password;
		const cid = req.query.cid;
		req.logger.info(`Este es el cid en getCarts del view ${cid}`)
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

		const cartDataRender = new CartDataRenderDTO({
			cart: cartData,
			user,
		});

		res.render('carts', cartDataRender);
	} catch(err) {
		req.logger.fatal(err)
	  res.status(500).send({ Error: "Internal server error" });
	}
};

export const addProductForm = async (req, res) => {
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

		const productRender = new ProductRenderDTO({
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
		})
	  res.render('addProduct', productRender );
	} catch (err) {
		req.logger.fatal(err)
	  res.status(500).send({ Error: 'Internal server error' });
	}
  };