import userModel from '../models/user.model.js';
import { cartModel } from '../models/cart.model.js';

class UserDAO {
	constructor() {
		this.model = userModel;
	}

	async getAll() {
		return await this.model.find();
	}

	async getByEmail(email) {
		return await this.model.findOne({ email: email });
	}

	async createUser(userData) {
		return await this.model.create(userData);
	}

	async getUserById(id) {
		return await this.model.findById(id);
	}

	async addCartById(userId, cartId) {
        try {

            const cart = await cartModel.findById(cartId);
			console.log(cart)


            const user = await this.model.findById(userId).populate({
                path: 'cart',
                model: 'carts'
            });
			console.log(user);

			user.cart = cart._id
			
			console.log(user)
            await user.save();

        } catch (err) {
            console.error(err);
        }
    };

	async findOne(user) {
		return await this.model.findOne({ email: user.email}).populate('cart');
	}

	async findByCartId(cartId) {
		return await this.model.findOne({ cart: cartId});
	}
}

const userDAO = new UserDAO();
export default userDAO;