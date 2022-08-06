const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		imgurl: {
			type: String,
			required: true,
			default:
				"https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png",
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.pre("findOneAndUpdate", async function (next) {
	const docToUpdate = await this.model.findOne(this.getQuery());
	// console.log(docToUpdate,this.password)
	// console.log(this._update)
	// // if(!this.isModified('password')){
	// //     next()
	// // }
	const salt = await bcrypt.genSalt(10);
	this._update.password = await bcrypt.hash(this._update.password, salt);
});

UserSchema.pre("remove", async function (next) {
	try {
		const user = this;
		await Folder.deleteMany({ user: user._id });
		await File.deleteMany({ user: user._id });
		next();
	} catch (e) {
		console.log("Error from the pre userschema of remove in models");
	}
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
