import userService from '../services/user.service.js';
import CurrentUserDTO from '../dto/currentUser.dto.js';
import enviroment from '../config/enviroment.js';
import nodemailer from 'nodemailer';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: enviroment.EMAIL,
        pass: enviroment.EMAIL_PASSWORD,
    },
});

// add cart to user POST method
export const addCartToUser = async (req, res) => {
    try {
		let userId = req.params.uid;
		let cartId = req.params.cid;
		req.logger.info(userId);
		

        await userService.addCartById(userId, cartId);
		req.logger.info("User Cart updated")
        res.status(201).send({ Message: "User Cart updated" });
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const getCurrentUser = async (req, res) => {
	
	const userStandard = req.session.user;

	const mongoUser = await userService.findOne(userStandard);

	req.logger.debug(mongoUser);

	const user = new CurrentUserDTO(mongoUser);

	req.logger.debug(user)

	if (!user) {
		req.logger.fatal('No user logged in')
		return res.status(404).send('No user logged in');
	}
	else {
		res.status(201).send({user})

	}
}

export const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const resetToken = await userService.generatePasswordResetToken(email);

	req.logger.debug(`Este es el resetToken en sessions.controller.js ${resetToken}`)

    if (resetToken) {
        const resetLink = `http://localhost:${enviroment.PORT}/passwordReset?resetToken=${resetToken}`;

        const mailOptions = {
			from: 'haboufaker@gmail.com',
			to: email,
			subject: 'Password Reset Request',
			html: `
				<h1>Password Reset Request</h1>
				<p>Click the following button to reset your password:</p>
				<a href="${resetLink}">
					<button style="background-color: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer;">Reset Password</button>
				</a>
			`
		};

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error sending email.');
            } else {
                console.log('Email sent: ' + info.response);
                res.send('Password reset instructions sent.');
            }
        });
    } else {
        res.status(400).send('User not found.');
    }
}

export const resetPassword = async (req, res) => {
	const resetToken = req.query.resetToken;
	const {newPassword, confirmPassword } = req.body;
	
	req.logger.debug(`Este es el token ${resetToken}`);

	const user = await userService.getByResetToken(resetToken);

	if (!user || user.resetTokenExpiration < Date.now()) {
		return res.redirect('/expiredLink'); // Redirect to a view indicating link expiration
	}

	if (comparePassword(user, newPassword)) {
		return res.redirect('/samePassword'); // Redirect to a view indicating same password
	}

	if (newPassword !== confirmPassword) {
		return res.redirect('/passwordMismatch'); // Redirect to a view indicating password mismatch
	}

	const hashedPassword = await hashPassword(newPassword);
	user.password = hashedPassword;
	user.resetToken = undefined;
	user.resetTokenExpiration = undefined;
	await user.save();

	res.redirect('/passwordResetSuccess'); // Redirect to a view indicating password reset success
}

export const updateUserRole= async (req, res) => {
	try {
	  const userId = req.body.userId;
	  const newRole = req.body.newRole;
  
	  if (newRole === 'premium' || newRole === 'user') {
		const updatedUser = await userService.changeUserRole(userId, newRole);
		res.status(201).send({ Message: "User role updated", updatedUser });
	  } else {
		res.status(400).send({ Error: "Invalid role" });
	  }
	} catch (err) {
	  res.status(500).send({ Error: "Internal server error" });
	}
}


export const deleteUser =async (req, res) => {
    try {
		const userId = req.params.uid;

        const user = await userService.getUserById(userId);

		if (!user) {
            res.status(404).send({ Error: "Not found" });
            return;
        }

		await userService.deleteUser(userId);
		res.status(201).send({ Message: "User deleted" });

	} catch (err) {
		console.log(err)
		req.logger.fatal(err)
		res.status(500).send({Message: "Internal server error"});
	}
};