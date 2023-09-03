// Import Express and ProductManager class
import express from 'express';
import handlebars from 'express-handlebars';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { viewsRouter } from './routes/views.router.js';
import {Server} from 'socket.io'
import { productsSocketService } from './utils/instances.js';
import mongoose from 'mongoose';
import { messageModel } from './models/message.model.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { sessionsRouter } from './routes/sessions.router.js';
import passport from 'passport';
import session from 'express-session';
import initializePassport from './config/passport.config.js';
import enviroment from './config/enviroment.js';
import ticketService from './services/ticket.service.js';
import userService from './services/user.service.js';
import errorManagerMiddleware from './middlewares/errorManager.middleware.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

//app and ProductManager instance creation
const app = express();

//json parsing middleware
app.use(express.json())
//data request parsing middleware
app.use(express.urlencoded({ extended: true }));

// Set handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', 'backend/views/');
app.use(express.static('frontend/public'));

// Middleware cookies parser
app.use(cookieParser(enviroment.COOKIE_PARSER_KEY));

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
				enviroment.DB_URL,
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: 'B2zdY3B$pHmxW%',
		resave: true,
		saveUninitialized: true,
	})
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(errorManagerMiddleware);
app.use(loggerMiddleware);


//MongoDB database
mongoose.connect(enviroment.DB_CREDENTIALS);

//Swagger API Dcoumentation
const swaggerOptions = {
	definition:{
		openapi:'3.0.1',
		info:{
			title:'Ecommerce API',
			version:'1.0.0',
			description:'Ecommerce API documentation for my backend project',
		}
	},
	apis:['backend/docs/**/*.yaml']
}
const specs = swaggerJsDoc(swaggerOptions);

app.use('/docs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs));

// use products router for "/api/products"
app.use('/api/products', productsRouter);

// use carts router for "/api/carts"
app.use('/api/carts', cartsRouter);

// use user router for "/api/sessions"
app.use('/api/sessions', sessionsRouter);


// use views router
app.use('/', viewsRouter);

app.get('/mail/:tid', async (req, res) => {
    
	const tid = req.params.tid;
	const ticket = await ticketService.getTicketById(tid)
	const user = await userService.getByEmail(ticket.purchaser)
	const mailOptions = {
        from: `Coderhouse Test <${process.env.EMAIL}>`,
        to: ticket.purchaser,
        subject: 'Thank you for your purchase!',
        html: `<h1>Hey ${user.first_name}! Your order #${ticket.code} has been succesfully placed for a total amount of $${ticket.amount} on ${ticket.purchase_datetime}</h1>`,
        attachments: [],
    };
})

app.get('/loggertTest', (req, res) => {
    try {
        req.logger.fatal('Fatal Error that will terminate the whole operation');
		req.logger.error('This an important Error');
		req.logger.warning('This is a warning, pay attention');
		req.logger.info('This log was created just for informational purposes');
		req.logger.http('This log was created just for http logs');
		req.logger.debug('This log was created just to help the programmer log small erros and debug');
        res.send('Errors');
    } catch (error) {
        req.logger.fatal("Error while handling errors as ironic as that sounds LOL");
        res.status(500).send("Error while handling errors as ironic as that sounds LOL");
    }

});

//Listening to port 8080
const webServer = app.listen(enviroment.PORT, () => {
	console.log(`Listening on port ${enviroment.PORT}`);
});

// socket.io init
const io = new Server(webServer);

// socket.io events
io.on('connection', async (socket) => {
	console.log('New client connected!');
	let products = await productsSocketService.getProducts();
	socket.emit('products', products);

	// Listening to messages sent by client and sharing them
	socket.on('new-product', async (product) => {
		await productsSocketService.addProduct(product.title, product.description, product.price, product.code, product.stock, product.thumbnail)
		let products = await productsSocketService.getProducts();
		io.sockets.emit('products', products);
	});

	socket.on('delete-product', async (id) => {
		let productId = Math.round(id)
		await productsSocketService.deleteProduct(productId)
		let products = await productsSocketService.getProducts();
		io.sockets.emit('products', products);
		console.log('product deleted!');
	});

	socket.on('message', async (data) => {
		await messageModel.create(data);
		let messages = await messageModel.find()
		io.sockets.emit('messageLogs', messages)
	})

	socket.on('connected1', async (data) => {
		socket.broadcast.emit('connected1', data.user)
	})

	socket.on('connected2', async () => {
		let messages = await messageModel.find()
		socket.emit('messageLogs', messages)
	})

	app.post('/realtimeproducts', async (req, res) => {
		try {
			let product = req.body
	
			let newProduct = await productsSocketService.addProduct(product.title, product.description, product.price, product.code, product.stock, product.thumbnail)
			if (newProduct === 400) {
				res.status(400).send({Message: "Bad request"})
			} else if (newProduct === 409) {
				res.status(409).send({Message: "The product code is already in the database; if you are trying to add a new product, please choose a different code."})
			} else {
				res.status(201).send({Message: "Product added"})
			}
			let products = await productsSocketService.getProducts();
			io.emit('products', products);
		} catch (err) {
			res.status(500).send({Message: "Internal server error"});
			let products = await productsSocketService.getProducts();
			io.emit('products', products);
		}
	});

	app.delete('/realtimeproducts/:pid', async (req, res) => {
		try {
			let id = Math.round(req.params.pid)
			let existingProduct = await productsSocketService.deleteProduct(id)
	
			if (existingProduct === -1) {
				res.status(404).send({Message: "Not found"})
			} else {
				res.status(201).send({Message: "Product deleted"})
			}
			let products = await productsSocketService.getProducts();
			io.emit('products', products);
		} catch (err) {
			res.status(500).send({Message: "Internal server error"});
			let products = await productsSocketService.getProducts();
			io.emit('products', products);
		}
	});
});