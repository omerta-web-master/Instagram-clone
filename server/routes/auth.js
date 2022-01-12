const express = require("express");
const { register, login, loadUser } = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/loaduser").post(loadUser);

module.exports = router;
