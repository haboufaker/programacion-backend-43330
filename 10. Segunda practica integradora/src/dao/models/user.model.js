import mongoose from 'mongoose';

const userCollection = 'users'

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
	password: String,
	age: Number,
	role: {
		type:String,
		default: "user"
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'carts',
		required: true,
		default: '123'
	},
});

userSchema.pre('find', function () {
    this.populate('cart')
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;