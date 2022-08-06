const express = require("express");
const morgan = require("morgan");
require("colors");
require("dotenv").config({ path: "./config/dev.env" });
const connectDB = require("./src/db/db");
const cors = require("cors");
connectDB();
const app = express();

require("./src/redis/redisServer");
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));

app.get("/removeAll", async (req, res) => {
	try {
		await User.deleteMany({});
		await Folder.deleteMany({});
		await File.deleteMany({});
		res.send({
			success: true,
			message: "Deleted successfully",
		});
	} catch (e) {
		console.log(e);
		res.send({
			success: false,
			error: e,
		});
	}
});

const userRoutes = require("./src/routes/userRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const folderRoutes = require("./src/routes/folderRoutes");
const searchRoutes = require("./src/routes/searchRoutes");

const User = require("./src/models/userModel");
const Folder = require("./src/models/folderModel");
const File = require("./src/models/fileModel");

app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => {
	console.log(`Server running on the port ${PORT}`.yellow);
});
