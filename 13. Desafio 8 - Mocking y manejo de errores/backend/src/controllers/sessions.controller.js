import userService from '../services/user.service.js';
import CurrentUserDTO from '../dto/currentUser.dto.js';

// add cart to user POST method
export const addCartToUser = async (req, res) => {
    try {
		let userId = req.params.uid;
		let cartId = req.params.cid;
		console.log(userId);
		

        await userService.addCartById(userId, cartId);

        res.status(201).send({ Message: "User Cart updated" });
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const getCurrentUser =async (req, res) => {
	
	const userStandard = req.session.user;

	const mongoUser = await userService.findOne(userStandard);

	console.log(mongoUser);

	const user = new CurrentUserDTO(mongoUser);

	console.log(user)

	if (!user) {
		return res.status(404).send('No user logged in');
	}
	else {
		res.status(201).send({user})

	}
}