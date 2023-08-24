import { Router } from 'express';
import { isAuth, isGuest, isUser, isAdmin } from '../middlewares/auth.middleware.js';
import { realTimeProducts, chat, products, getCarts, addProductForm } from '../controllers/views.controller.js';


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

viewsRouter.get(`/carts/`, getCarts);

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

viewsRouter.get('/products/add', isAdmin, addProductForm);

viewsRouter.get('/forgotPassword',(req, res) => {
    res.render('forgotPassword');
});

viewsRouter.get('/passwordReset',(req, res) => {
	const resetToken = req.query.resetToken;
    res.render('passwordReset', {resetToken});
});

viewsRouter.get('/expiredLink',(req, res) => {
    res.render('expiredLink');
});

viewsRouter.get('/passwordMismatch',(req, res) => {
    res.render('passwordMismatch');
});

viewsRouter.get('/passwordResetSuccess',(req, res) => {
    res.render('passwordResetSuccess');
});

viewsRouter.get('/samePassword',(req, res) => {
    res.render('samePassword');
});

viewsRouter.get('/premium',(req, res) => {
    res.render('premium');
});

// Router export
export {viewsRouter}