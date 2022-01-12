const express = require("express");
const { getUser, getUsers, updateUser } = require("../controllers/users");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:username").get(getUser);
router.route("/:id").put(updateUser);

module.exports = router;
