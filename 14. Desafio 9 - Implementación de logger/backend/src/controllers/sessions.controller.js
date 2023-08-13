import userService from '../services/user.service.js';
import CurrentUserDTO from '../dto/currentUser.dto.js';

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

export const getCurrentUser =async (req, res) => {
	
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