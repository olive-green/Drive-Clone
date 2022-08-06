const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
	createFile,
	copyFile,
	moveFile,
	deleteFile,
	recycled,
	removeFromRecycle,
} = require("../controllers/fileControllers");

router.route("/create").post(protect, createFile); // api/files/create
router.route("/move/:id").post(protect, moveFile); // api/files/move/:id
router.route("/copy/:id").put(protect, copyFile); // api/files/copy/:id
router.route("/delete/:id").delete(protect, deleteFile); // api/files/delete/:id
router.route("/recycled/:id").put(protect, recycled);
// router.route('/recover/:id').put(protect,removeFromRecycle)
module.exports = router;
