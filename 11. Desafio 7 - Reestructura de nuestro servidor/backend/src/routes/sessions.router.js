import { Router } from 'express';
import passport from 'passport';
import userService from '../services/user.service.js';
import mongoose from 'mongoose';
import userModel from '../dao/models/user.model.js';
import enviroment from '../config/enviroment.js';

const sessionsRouter = Router();

sessionsRouter.post(
	'/',
	passport.authenticate('register', { failureRedirect: '/api/sessions/registererror' }),
	async (req, res) => {
		res.redirect('/login');
	}
);

sessionsRouter.get('/registererror', async(req,res) => {
	console.log("Could not sign up user");
	res.send({error: "Could not sign up user"})
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
	console.log("Could not log in");
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
sessionsRouter.post('/:uid/cart/:cid', async (req, res) => {
    try {
		let userId = req.params.uid;
		let cartId = req.params.cid;
		console.log(userId);
		

        await userService.addCartById(userId, cartId);

        res.status(201).send({ Message: "User Cart updated" });
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

sessionsRouter.get('/current', async (req, res) => {
	
	const userStandard = req.session.user;

	const user = await userModel.findOne({ email: userStandard.email}).populate('cart');


	console.log(user)

	if (!user) {
		return res.status(404).send('No user logged in');
	}
	else {
		res.status(201).send({user})

	}
})


export { sessionsRouter };