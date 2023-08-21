import { Router } from 'express';
import passport from 'passport';
import enviroment from '../config/enviroment.js';
import { addCartToUser, getCurrentUser, forgotPassword, resetPassword, premium } from '../controllers/sessions.controller.js';

const sessionsRouter = Router();

sessionsRouter.post(
	'/',
	passport.authenticate('register', { failureRedirect: '/api/sessions/registererror' }),
	async (req, res) => {
		res.redirect('/login');
	}
);

sessionsRouter.get('/registererror', async(req,res) => {
	try{
		req.logger.fatal("Could not sign up user");
		res.send({error: "Could not sign up user"})
	} catch (error) {
        req.logger.fatal("Error while handling errors as ironic as that sounds LOL");
        res.status(500).send("Error while handling errors as ironic as that sounds LOL");
    }
	
})

sessionsRouter.post(
	'/auth',
	passport.authenticate('login', { failureRedirect: '/api/sessions/loginerror' }),
	async (req, res) => {
		if (!req.user) return res.status(404).send('No user found');

		const user = req.user;

		delete user.password;

		req.session.user = user;

		if (user.email === enviroment.ADMIN_USER) {
			req.session.admin = true
		}

		res.redirect('/login');
	}
);

sessionsRouter.get('/loginerror', async(req,res) => {
	req.logger.fatal("Could not log in");
	res.send({error: "Could not log in"})
})

sessionsRouter.post('/logout', (req, res) => {
	req.session.destroy();

	res.redirect('/login');
});

sessionsRouter.post('/signup', (req, res) => {
	res.redirect('/register');
});

sessionsRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {}
);

sessionsRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/api/sessions/login' }),
	(req, res) => {
		req.session.user = req.user;
		res.redirect('/login');
	}
);

// add cart to user POST method
sessionsRouter.post('/:uid/cart/:cid', addCartToUser);

// Get Current user GET method
sessionsRouter.get('/current', getCurrentUser)

sessionsRouter.post('/carts/:cid', (req, res) => {
	const id = req.params.cid
	req.logger.debug(`Este es el cartId ${id}`)
	res.redirect(`/carts/?cid=${id}`);
});

sessionsRouter.get('/forgotPassword', (req, res) => {
	res.redirect('/forgotPassword');
});

sessionsRouter.get('/passwordReset', (req, res) => {
    const resetToken = req.query.resetToken;
	req.logger.debug(`Este es el token ${resetToken}`)
    res.render('passwordReset', { resetToken });
});

sessionsRouter.post('/forgotPassword', forgotPassword);

sessionsRouter.post('/resetPassword', resetPassword );

sessionsRouter.post('/premium/:uid', premium);


export { sessionsRouter };