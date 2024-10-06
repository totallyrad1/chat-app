const express = require("express");
const {registerUser, loginUser, findUser, getUsers, changeUserSettings} = require("../Controllers/userController");

const router = express.Router();

router.post("/update", changeUserSettings);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

module.exports = router;