const { protect } = require("../middleware/authMiddleware");
const {
	createFolder,
	copyFolder,
	moveFolder,
	deleteFolder,
	getParentFolder,
	getFolder,
	recycled,
	removeFromRecycle,
} = require("../controllers/folderControllers");
const router = require("express").Router();

router.route("/:id").get(protect, getParentFolder); // api/folders/:id
router.route("/details/:id").get(protect, getFolder); // api/folders/details/:id
router.route("/create").post(protect, createFolder); // api/folders
router.route("/move/:id").post(protect, moveFolder);
router.route("/copy/:id").put(protect, copyFolder);
router.route("/delete/:id").delete(protect, deleteFolder);
router.route("/recycled/:id").put(protect, recycled);
router.route("/recover/:id").put(protect, removeFromRecycle);

module.exports = router;
