import { Router } from 'express';
import { productsController } from "../utils/instances.js";
import { messageModel } from '../dao/models/message.model.js';

// Router instance
const viewsRouter = Router();

// Home route definition
viewsRouter.get('/', async (req, res) => {
	// Render index view
	try {
		let products = await productsController.getProducts();
		res.render('home', {products});
		console.log(products)
	} catch {
		res.status(500).send({Error: "Internal server error"});
	}
	
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
	try {
		let products = await productsController.getProducts();
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
// Exportamos el router
export {viewsRouter}