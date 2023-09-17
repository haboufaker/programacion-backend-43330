import passport from 'passport';
import local from 'passport-local';
import userService from '../services/user.service.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.util.js';
import GitHubStrategy from 'passport-github2';
import enviroment from '../config/enviroment.js';
import NewUserDTO from '../dto/newUser.dto.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{ usernameField: 'email', passReqToCallback: true },
			async (req, username, password, done) => {
				const { first_name, last_name, age, role, cart } = req.body;

				try {

                    if (username === enviroment.ADMIN_USER) {
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

                        const newUser = new NewUserDTO({first_name,
                            last_name,
                            email: username,
                            password: hashedPassword,
                            age,
                            role,
							cart
                        });

						const userCreation = await userService.createUser(newUser)

                        return done(null, userCreation);
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
                    if (username === enviroment.ADMIN_USER && password === enviroment.ADMIN_PASS) {
                        const user = {
                            first_name: "Coder",
                            last_name: "House",
                            email: enviroment.ADMIN_USER,
                            password: enviroment.ADMIN_PASS,
                            age: 99,
                            role: "admin",
							cart: null,
							last_connection: new Date,
                        };


			            return done(null, user);
                    } else if (username === enviroment.ADMIN_USER && password !== enviroment.ADMIN_PASS) {
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
				clientID: enviroment.CLIENT_ID,
				clientSecret: enviroment.CLIENT_SECRET,
				callbackURL: enviroment.CALLBACK_URL
			},
			async (res, accessToken, refreshToken, profile, done) => {
				try {
					let user = await userService.getByEmail(
						profile._json.email
					);
					if (!user) {
						let newUser = new NewUserDTO({
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							age: 18,
                            role: "user",
							cart: null
						});
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