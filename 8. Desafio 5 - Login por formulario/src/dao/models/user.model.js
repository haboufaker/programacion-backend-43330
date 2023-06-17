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
	}
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;