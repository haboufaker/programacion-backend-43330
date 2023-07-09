import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/service/user.service.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.util.js';
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{ usernameField: 'email', passReqToCallback: true },
			async (req, username, password, done) => {
				const { first_name, last_name, age, role, cart } = req.body;

				try {

                    if (username === "adminCoder@coder.com") {
                        return done(null, false, {
                            message: 'Ivalid credentials',
                        });
                    } else {

                        const user = await userService.getByEmail(username);

                        if (user) {
                            return done(null, false, {
                                message: 'User already exists',
                            });
                        }

                        const hashedPassword = await hashPassword(password);

                        const newUser = await userService.createUser({
                            first_name,
                            last_name,
                            email: username,
                            password: hashedPassword,
                            age,
                            role,
							cart
                        });

                        return done(null, newUser);
                    }
				} catch (error) {
					done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser(async (user, done) => {
		/**const user = await userService.getUserById(id);**/
		done(null, user);
	});

	passport.use(
		'login',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
                    if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
                        const user = {
                            first_name: "Coder",
                            last_name: "House",
                            email: "adminCoder@coder.com",
                            password: "adminCod3r123",
                            age: 99,
                            role: "admin",
							cart: null
                        };


			            return done(null, user);
                    } else if (username === "adminCoder@coder.com" && password !== "adminCod3r123" ) {
                        return done(null, false, {
                            message: 'Invalid data',
                        });
                    } else {

                        const user = await userService.getByEmail(username);

                        if (!user) {
                            return done(null, false, { message: 'User not found' });
                        }

                        if (!comparePassword(user, password)) {
                            return done(null, false, { message: 'Invalid data' });
                        }

                        return done(null, user);
                    }
                } catch (error) {
                    done(error);
                }
		    }
        )
	);

    passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: 'Iv1.3f217842454e66bf',
				clientSecret: '158533fc3dca490fc4fc9ee1c6c1a5d76af090f8',
				callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
			},
			async (res, accessToken, refreshToken, profile, done) => {
				try {
					console.log(profile);
					let user = await userService.getByEmail(
						profile._json.email
					);
					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							age: 18,
                            role: "user",
							cart: null
						};
						user = await userService.createUser(newUser);
						done(null, user);
					} else {
						done(null, user);
					}
				} catch (error) {
					done(error, false);
				}
			}
		)
	);
};

export default initializePassport;