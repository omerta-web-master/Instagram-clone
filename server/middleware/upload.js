const multer = require("multer");
const path = require("path");

const postsStorage = multer.diskStorage({
	destination: function (req, res, cb) {
		cb(null, `uploads/posts`);
	},
	filename: function (req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

const avatarsStorage = multer.diskStorage({
	destination: function (req, res, cb) {
		cb(null, `uploads/avatars`);
	},
	filename: function (req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

exports.uploadPostImage = multer({ storage: postsStorage });

exports.uploadAvatarImage = multer({ storage: avatarsStorage });
