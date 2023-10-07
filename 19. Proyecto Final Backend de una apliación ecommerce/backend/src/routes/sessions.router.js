import passport from 'passport';
import { Router } from 'express';
import enviroment from '../config/enviroment.js';
import { addCartToUser, getCurrentUser, forgotPassword, resetPassword, updateUserRole, deleteUser, uploadDocuments, premium, uploadProfileImage, getUsersMainData, clearInactiveUsers } from '../controllers/sessions.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import userModel from '../models/user.model.js';
import multer from 'multer';
import { upload } from '../middlewares/multerConfig.js';
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
		if (!req.user) {
			return res.status(404).json({ error: 'No user found' });
		}
		const user = req.user;

		// Update the user's last_connection property to the current date and time
		if (!(user.role === "admin")) {
			user.last_connection = new Date();
			await user.save();
		}

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

sessionsRouter.post('/logout', async (req, res) => {
	// Get the user ID from the session
	const userId = req.session.user._id;

	// Find the user by ID and update the last_connection property
	const user = await userModel.findByIdAndUpdate(
		userId,
		{ last_connection: new Date() },
		{ new: true }
	);
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

sessionsRouter.get('/premium/:uid', isAdmin, premium);

sessionsRouter.post('/updateUserRole', updateUserRole);

// Delete product DELETE method
sessionsRouter.delete('/:uid', deleteUser);

sessionsRouter.post('/:uid/documents', upload.single('document'), uploadDocuments);

sessionsRouter.post('/uploadProfileImage/:uid', upload.single('profileImage'), uploadProfileImage);

sessionsRouter.get('/', getUsersMainData);

sessionsRouter.delete('/', clearInactiveUsers);

export { sessionsRouter };