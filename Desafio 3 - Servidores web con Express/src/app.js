// Import Express and ProductManager class
import express from 'express';
import ProductManager from './productManager.js';

//app and ProductManager instance creation
const app = express();
const productManager = new ProductManager();
app.use(express.urlencoded({ extended: true }));

//Get method definition for the ./products route
app.get('/products/', async (req, res) => {
	try {
		let limit = req.query.limit;
		let allProducts = await productManager.getProducts();

		if (!limit || (typeof Math.round(limit)) !== "number" || isNaN(Math.round(limit)) || Math.round(limit) < 0 || Math.round(limit) >= allProducts.length) {
			res.send({allProducts});
		} else {
			allProducts.splice(limit, allProducts.length)
			res.send({allProducts});
		}
	} catch (err) {
		res.send(err);
	}
});

//Get method definition for the ./products with pid parameter
app.get('/products/:pid', async (req, res) => {
	try {
		let id = Math.round(req.params.pid)
		let existingProduct = await productManager.getProductById(id);
		if (existingProduct === false) {
			res.send({Error: "Not found"})
		} else {
			res.send({existingProduct});
		}
		
	} catch (err) {
		res.send(err);
	}
});

//Listening to port 8080
app.listen(8080, () => {
	console.log('Listening to port 8080');
});

