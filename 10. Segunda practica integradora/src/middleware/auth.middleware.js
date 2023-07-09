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
	if (req.session.user === "adminCoder@coder.com" && req.session.password === "adminCod3r123" && req.session.admin) {
		next();
	} else {
		res.redirect('/products');
	}
}

