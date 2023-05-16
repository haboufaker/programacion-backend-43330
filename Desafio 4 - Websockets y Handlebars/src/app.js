// Import Express and ProductManager class
import express from 'express';
import handlebars from 'express-handlebars';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { viewsRouter } from './routes/views.router.js';
import {Server} from 'socket.io'
import { productsController } from './utils/instances.js';

//app and ProductManager instance creation
const app = express();

//json parsing middleware
app.use(express.json())
//data request parsing middleware
app.use(express.urlencoded({ extended: true }));

// Set handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', 'views/');
app.use(express.static('public'));

// use products router for "/api/products"
app.use('/api/products', productsRouter);

// use products router for "/api/products"
app.use('/api/carts', cartsRouter);


// use views router
app.use('/', viewsRouter);

//Listening to port 8080
const webServer = app.listen(8080, () => {
	console.log('Listening on port 8080');
});

// socket.io init
const io = new Server(webServer);

// socket.io events
io.on('connection', async (socket) => {
	console.log('New client connected!');
	let products = await productsController.getProducts();
	socket.emit('products', products);

	// Listening to messages sent by client and sharing them
	socket.on('new-product', async (product) => {
		console.log(product);
		productsController.addProduct(product.title, product.description, product.price, product.code, product.stock, product.thumbnail)
		let products = await productsController.getProducts();
		// Propago el evento a todos los clientes conectados
		io.emit('products', products);
	});

	socket.on('delete-product', async (id) => {
		console.log(id);
		let productId = Math.round(id)
		productsController.deleteProduct(productId)
		let products = await productsController.getProducts();
		// Propago el evento a todos los clientes conectados
		io.emit('products', products);
	});
});