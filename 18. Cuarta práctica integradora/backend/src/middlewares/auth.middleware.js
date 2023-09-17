export function isAuth(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/products');
	}
}

export function isAdmin(req, res, next) {
	if (req.session.user.email === "adminCoder@coder.com" || req.session.user.role === 'premium') {
		next();
	} else {
		res.redirect('/products');
	}
}

export function isUser(req, res, next) {
	if (!req.session.admin) {
		next();
	} else {
		res.redirect('/products');
	}
}