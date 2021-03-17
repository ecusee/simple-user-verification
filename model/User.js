const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	country: {
		type: String,
		required: true
	},
	isValid: {
		type: Boolean,
		default : false
	},
	confirmationCode: {
		type: String,
	}
})

module.exports = mongoose.model("User", UserSchema);