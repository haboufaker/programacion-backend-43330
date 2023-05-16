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

const products = await productsController.getProducts();

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
io.on('connection', (socket) => {
	console.log('New client connected!');
	socket.emit('products', products);

	// Listening to messages sent by client and sharing them
	socket.on('new-product', (product) => {
		console.log(product);
		let newProduct = productsController.addProduct(product.title, product.description, product.price, product.code, product.stock, product.thumbnail)
		// Agrego el mensaje al array de mensajes
		products.push(newProduct);
		// Propago el evento a todos los clientes conectados
		io.emit('new-product', products);
	});

	socket.on('delete-product', (id) => {
		console.log(id);
		let productId = Math.round(id)
		productsController.deleteProduct(productId)
		// Propago el evento a todos los clientes conectados
		io.emit('delete-product', products);
	});
});