const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

const { searchByLetter } = require("../controllers/searchController");
const cache = require("../middleware/cachingMiddleware");

// Search Route
router.route("/:query").get(protect, cache, searchByLetter);

module.exports = router;
