// Import Express and ProductManager class
import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';

//app and ProductManager instance creation
const app = express();

//json parsing middleware
app.use(express.json())
//data request parsing middleware
app.use(express.urlencoded({ extended: true }));

// use products router for "/api/products"
app.use('/api/products', productsRouter);

// use products router for "/api/products"
app.use('/api/carts', cartsRouter);

//Listening to port 8080
app.listen(8080, () => {
	console.log('Listening to port 8080');
});

