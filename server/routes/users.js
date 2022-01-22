const express = require("express");
const { uploadAvatarImage } = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const {
	getUser,
	getUsers,
	updateUser,
	getUserById,
	uploadAvatar,
} = require("../controllers/users");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:username").get(getUser);
router.route("/:id").put(updateUser);
router
	.route("/:id/upload")
	.post(protect, uploadAvatarImage.single("avatar"), uploadAvatar);
router.route("/id/:id").get(getUserById);

module.exports = router;
