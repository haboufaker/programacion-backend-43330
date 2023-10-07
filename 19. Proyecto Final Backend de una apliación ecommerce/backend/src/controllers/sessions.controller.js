import userService from '../services/user.service.js';
import CurrentUserDTO from '../dto/currentUser.dto.js';
import enviroment from '../config/enviroment.js';
import nodemailer from 'nodemailer';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';
import userModel from '../models/user.model.js';

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
export const premium = async (req, res) => {
	const userId = req.params.uid;

	// Check if the user has uploaded the required documents
	const user = await userModel.findById(userId);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	const requiredDocuments = ['ID', 'Proof of address', 'Proof of statement'];
	let errorMessage;

	if (!user.documents || user.documents.length === 0) {
		errorMessage = 'This user must upload all required documents before upgrading to premium.';
		res.render('premium', { userId, errorMessage });
	} else {
		const documentExists = requiredDocuments.every((document) =>
			user.documents.some((doc) => doc.name === document)
		);

		if (!documentExists) {
			errorMessage = 'This user must upload all required documents before upgrading to premium.';
			res.render('premium', { userId, errorMessage });
		} else {
			// Render the premium.handlebars template without an error message
			res.render('premium', { userId });
		}
	}
};
// Update user role and check for required documents
export const updateUserRole = async (req, res) => {
	try {
		const userId = req.body.userId;
		const newRole = req.body.newRole;

		if (newRole === 'premium') {
			// Check if the user has uploaded the required documents
			const user = await userService.getUserById(userId);

			if (!user) {
				return res.status(404).send({ Error: 'User not found' });
			}

			const requiredDocuments = ['ID', 'Proof of address', 'Proof of statement'];

			for (const document of requiredDocuments) {
				const documentExists = user.documents.some(
				(doc) => doc.name === document
				);

				if (!documentExists) {
					const errorMessage = 'This user must upload all required documents before upgrading to premium';
					return res.render('premium', { userId, errorMessage });
				}
			}
		}

		// Update the user's role
		const updatedUser = await userService.changeUserRole(userId, newRole);
		const errorMessage = 'User role succesfully updated!';
		return res.render('premium', { userId, errorMessage });
	} catch (err) {
		res.status(500).send({ Error: 'Internal server error' });
	}
};


export const deleteUser = async (req, res) => {
    try {
		const userId = req.params.uid;

        const user = await userService.getUserById(userId);

		if (!user) {
            res.status(404).send({ Error: "Not found" });
            return;
        }

		await userService.deleteUser(userId);
		
		const message = 'User deleted successfully.';
		res.render('products', {message});

	} catch (err) {
		req.logger.fatal(err)
		res.status(500).send({Message: "Internal server error"});
	}
};

// Document upload route
export const uploadDocuments = async (req, res) => {
	try {
		const userId = req.params.uid;
		const uploadedDocument = req.file; // Use req.file to access the uploaded file

		if (!uploadedDocument) {
			return res.status(400).json({ error: 'No document uploaded.' });
		}

		// Find the user by ID
		const user = await userService.getUserById(userId);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Set the document name based on user input
		const documentType = req.body.documentType;

		user.documents.push({
		name: documentType,
		reference: uploadedDocument.filename, // Set the reference to the uploaded filename
		});

		// Save the user with the updated documents array
		await user.save();

		// Redirect back to premium.handlebars with a success message
		const errorMessage = 'Document uploaded successfully.';
		res.render('premium', { userId, errorMessage });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while uploading the document.' });
	}
};

export const uploadProfileImage = async (req, res) => {
	const userId = req.params.uid;

	try {
		// Check if the user exists and is logged in
		const user = await userModel.findById(userId);

		if (!user) {
		return res.status(404).json({ error: 'User not found' });
		}

		// Handle profile image upload here
		// You can save the uploaded image information in the user's document or database record
		const uploadedImage = req.file; // Uploaded image file
		const imageUrl = `/uploads/profiles/${uploadedImage.filename}`; // URL of the uploaded image

		// Update the user's profile image property
		user.documents.push({
			name: 'Profile image',
			reference: imageUrl,
		});

		// Save the updated user
		await user.save();

		res.render('login');
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'An error occurred while uploading the profile image.' });
	}
};

export const getUsersMainData = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email age role last_connection');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE /api/sessions - Clearing Inactive Users
export const clearInactiveUsers = async (req, res) => {
    try {
        const inactiveThreshold = new Date();
        inactiveThreshold.setDate(inactiveThreshold.getDate() - 2); // Modify the threshold as needed

        // Find users who haven't been active since the threshold date
        const usersToDelete = await userModel.find({
            last_connection: { $lt: inactiveThreshold },
        });

        // Delete each user and send email notifications
        for (const user of usersToDelete) {
            // Send email notifications to deleted users
            const mailOptions = {
                from: `Coderhouse Test <${enviroment.EMAIL}>`,
                to: user.email,
                subject: 'Account Deletion Notification',
                text: `Dear ${user.first_name},\n\nYour account has been deleted due to inactivity. If you wish to reactivate your account, please contact our support team.\n\nSincerely, The backend ecommerce Team`,
            };

            // Send email
            await transporter.sendMail(mailOptions);

            // Delete the user
            await userModel.findByIdAndDelete(user._id);
        }

        res.status(200).json({ message: 'Inactive users deleted', deletedCount: usersToDelete.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
