const express = require("express");
const { protect } = require("../middleware/auth");
const {
	follow,
	unfollow,
	getFollowSuggestions,
} = require("../controllers/follow");

const router = express.Router();

router.route("/follow/:id").post(protect, follow);
router.route("/unfollow/:id").post(protect, unfollow);
router.route("/suggestions").get(protect, getFollowSuggestions);

module.exports = router;
