const File = require("../models/fileModel");
const Folder = require("../models/folderModel");
const User = require("../models/userModel");
const redisClient = require("../redis/redisServer");

const searchByLetter = async (req, res) => {
	try {
		const queryString = req.params.query;
		const user = req.user;
		if (!user) {
			return res.status(401).send({
				success: false,
				error: "Unauthorized",
			});
		}
		const userID = user._id;

		const files = await File.find({ user: userID });
		let fileData = [];
		files.map((item) => {
			if (queryString == item.name.substr(0, queryString.length)) {
				fileData.push(item);
			}
		});
		// Folder Data
		const folders = await Folder.find({ user: userID });
		let folderData = [];
		folders.map((item) => {
			if (queryString == item.name.substr(0, queryString.length)) {
				folderData.push(item);
			}
		});

		let obj = {
			fileData: fileData,
			folderdata: folderData,
		};

		redisClient.setex(queryString + userID, 7200, JSON.stringify(obj));
		res.status(201).json({
			success: true,
			message: "Successfully Request Made",
			data: {
				fileData: fileData,
				folderData: folderData,
			},
		});
	} catch (e) {
		if (e.name === "ValidationError") {
			console.log(e);
			const messages = Object.values(e.errors).map((val) => val.message);
			res.status(400).json({
				success: false,
				error: messages,
			});
		} else {
			console.log(`Error occured ${e}`);
			return res.status(500).json({
				success: false,
				error: `${e}`,
			});
		}
	}
};

module.exports = { searchByLetter };
