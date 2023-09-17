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
		enum: ["user", "admin", "premium"],
		default: "user"
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'carts',
		default: null
	},
	resetToken: String,
    resetTokenExpiration: Date,
	documents: [
		{
			name: String,
			reference: String,
		},
	],
	last_connection: Date,
});

userSchema.pre('find', function () {
    this.populate('cart')
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;