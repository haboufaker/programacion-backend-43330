import userDAO from "../dao/user.dao.js";

class UserService {
	constructor() {
		this.model = userDAO;
	}

	async getAll() {
		return await this.model.getAll();
	}

	async getByEmail(email) {
		return await this.model.getByEmail(email);
	}

	async createUser(userData) {
		return await this.model.createUser(userData);
	}

	async getUserById(id) {
		return await this.model.getUserById(id);
	}

	async addCartById(userId, cartId) {
        return await this.model.addCartById(userId, cartId);
    };

	async findOne(user) {
        return await this.model.findOne(user);
    };

	async findByCartId(cartId) {
		return await this.model.findOne(cartId);
	}

	async generatePasswordResetToken(email) {
		return await this.model.generatePasswordResetToken(email);
	}

	async getByResetToken(resetToken) {
		return await this.model.getByResetToken(resetToken);
	}

	async changeUserRole(userId, newRole) {
		const user = await this.model.getUserById(userId);
		if (user) {
			user.role = newRole;
			await user.save();
			return user;
		}
		return null;
	}

	async deleteUser(userId) {
		return await this.model.deleteUser(userId)
	}
	
}

const userService = new UserService();
export default userService;