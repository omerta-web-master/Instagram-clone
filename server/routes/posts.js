const express = require("express");
const {
	createPost,
	getPosts,
	giveLike,
	removeLike,
	addComment,
	removeComment,
} = require("../controllers/posts");
const { uploadPostImage } = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

router
	.route("/")
	.post(protect, uploadPostImage.single("image"), createPost)
	.get(protect, getPosts);

router.route("/:id/like").put(protect, giveLike);
router.route("/:id/like").delete(protect, removeLike);

router.route("/:id/comments").post(protect, addComment);

router.route("/:id/comments/:commentId").delete(protect, removeComment);

module.exports = router;
