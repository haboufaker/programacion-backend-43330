import { Router } from 'express';
import { isAuth, isGuest, isUser } from '../middlewares/auth.middleware.js';
import { realTimeProducts, chat, products, getCarts } from '../controllers/views.controller.js';


// Router instance
const viewsRouter = Router();

viewsRouter.get('/', isAuth, (req, res) => {
	const { user } = req.session;
	delete user.password;
	res.render('login', {
		title: 'User Profile',
		user,
	});
});

viewsRouter.get('/realtimeproducts', realTimeProducts);

viewsRouter.get('/chat', isUser, chat);

viewsRouter.get('/products', products);

viewsRouter.get('/carts/:cid', getCarts);

viewsRouter.get('/register', isGuest, (req, res) => {
	res.render('register', {
		title: 'Sign up',
	});
});

viewsRouter.get('/login', isGuest, (req, res) => {
	res.render('login', {
		title: 'Sign in',
	});
});

viewsRouter.get('/userProfile', isAuth, (req, res) => {
	const { user } = req.session;
	delete user.password;
	res.render('userProfile', {
		title: 'User Profile',
		user,
	});
});


// Router export
export {viewsRouter}