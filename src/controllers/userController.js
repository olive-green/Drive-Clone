const User = require("../models/userModel");
const Folder = require("../models/folderModel");
const generateToken = require("../utils/generateToken");
const File = require("../models/fileModel");

const authUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user && (await user.matchPassword(password))) {
			res.json({
				success: true,
				message: "Successfully LoggedIn",
				data: {
					_id: user._id,
					name: user.name,
					email: user.email,
					imgurl: user.imgurl,
					token: generateToken(user._id),
				},
			});
		} else {
			throw new Error("Invalid email or password");
		}
	} catch (e) {
		console.log(e);
		let error = `${e}`.split(":");
		let message;
		if (error[0] === "Error") {
			message = error[1];
		} else {
			message = "Failed to login";
		}
		res.json({ success: false, message: message });
		res.status(400);
	}
};

const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ email });
		if (userExists) {
			throw new Error("User already exists");
		}
		const user = await User.create({
			name,
			email,
			password,
		});
		if (user) {
			const headFolder = await Folder.create({
				parentFolder: user._id,
				name: "Parent",
				childFolder: [],
				childFiles: [],
				user: user._id,
			});
			if (!headFolder) {
				await User.findByIdAndDelete(user._id);
				throw new Error("Parent Folder cant be created");
			}
			res.status(201).json({
				success: true,
				message: "Successfully Registered",
				data: {
					_id: user._id,
					name: user.name,
					email: user.email,
					imgurl: user.imgurl,
					token: generateToken(user._id),
				},
			});
		} else {
			throw new Error("Invalid user data");
		}
	} catch (e) {
		console.log(e);
		let error = `${e}`.split(":");
		let message;
		if (error[0] === "Error") {
			message = error[1];
		} else {
			message = "Failed to register";
		}
		res.json({ success: false, message: message });
		res.status(400);
	}
};

const recent = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(200).json({
				success: false,
				error: "Not authorised",
			});
		}
		const folders = await Folder.find({ user: user }).sort({
			createdAt: "asc",
		});
		const files = await File.find({ user: user }).sort({
			createdAt: "asc",
		});
		if (!folders || !files) {
			return res.status(200).json({
				success: false,
				error: "Error in fetching data",
			});
		}
		res.status(200).json({
			success: true,
			data: {
				files: files,
				folders: folders,
			},
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			error: "Server error",
		});
	}
};

const recycleBin = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(200).json({
				success: false,
				error: "Not authorised",
			});
		}
		const folders = await Folder.find({
			user: user._id,
			isrecycled: true,
		}).sort({
			recycledDate: "asc",
		});

		const files = await File.find({
			user: user._id,
			isrecycled: true,
		}).sort({
			recycledDate: "asc",
		});
		if (!folders || !files) {
			return res.status(200).json({
				success: false,
				error: "Error in fetching data",
			});
		}
		res.status(200).json({
			success: true,
			data: {
				files: files,
				folders: folders,
			},
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			error: "Server error",
		});
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const { name, email, password, imgurl } = req.body;
		const userId = req.user._id;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(200).json({
				success: false,
				error: "No such user found",
			});
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.imgurl = imgurl || user.imgurl;
		if (password) {
			user.password = password;
		}

		const savedUser = await user.save();

		return res.status(201).json({
			success: true,
			data: savedUser,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			error: "Server error",
		});
	}
};

const getUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId).select("-password");
		if (!user) {
			res.status(200).json({
				success: false,
				error: "No such user found",
			});
		}
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			error: "Server error",
		});
	}
};

module.exports = {
	authUser,
	registerUser,
	recent,
	updateUserProfile,
	getUser,
	recycleBin,
};
