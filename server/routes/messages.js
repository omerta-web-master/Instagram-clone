const express = require("express");
const { protect } = require("../middleware/auth");
const { addMessage, getMessages } = require("../controllers/messages");

const router = express.Router();

router.route("/").post(protect, addMessage);
router.route("/:conversation").get(protect, getMessages);

module.exports = router;
