const express = require("express");
const { protect } = require("../middleware/auth");
const {
	getConversationsOfLoggedInUser,
	createConversation,
} = require("../controllers/conversations");

const router = express.Router();

router.route("/me").get(protect, getConversationsOfLoggedInUser);
router.route("/").post(protect, createConversation);

module.exports = router;
