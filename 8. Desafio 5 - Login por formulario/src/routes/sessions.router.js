import { Router } from 'express';
import userService from '../dao/service/user.service.js';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
	const { email, password } = req.body;

	if (email === "adminCoder@coder.com") {
		throw new Error('Invalid credentials')
	}
	const userData = req.body;
	try {
		const newUser = await userService.createUser(userData);
		console.log(newUser)
		res.redirect('/login');
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

sessionsRouter.post('/auth', async (req, res) => {
	const { email, password } = req.body;
	try {

		if (email === "adminCoder@coder.com" && password === "adminCod3r123" ) {
			const user = {
				first_name: "Coder",
				last_name: "House",
				email: "adminCoder@coder.com",
				password: "adminCod3r123",
				age: 99,
				role: "admin",
			};

			req.session.user = user
			req.session.admin = true

			res.redirect('/login');
		} else if (email === "adminCoder@coder.com" && password !== "adminCod3r123" ) {
			throw new Error('Invalid data')
		} else {
			const user = await userService.getByEmail(email);

			if (!user) throw new Error('Invalid data'); 
			if (user.password !== password) throw new Error('Invalid data');

			req.session.user = user;

			res.redirect('/login');
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

sessionsRouter.post('/logout', (req, res) => {
	req.session.destroy();
    
	res.redirect('/login');
});

sessionsRouter.post('/signup', (req, res) => {
	res.redirect('/register');
});

export { sessionsRouter };