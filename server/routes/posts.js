const express = require("express");
const { createPost, getPosts } = require("../controllers/posts");
const { uploadPostImage } = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

router
	.route("/")
	.post(protect, uploadPostImage.single("image"), createPost)
	.get(protect, getPosts);

module.exports = router;
