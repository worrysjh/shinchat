const express = require("express");
const router = express.Router();
const { fetchAllUser, getMyProfile } = require("../controllers/userController");
const { authenticateToken } = require("../middelwares/authMiddleware");

router.get("/me", authenticateToken, getMyProfile);
router.get("/all", authenticateToken, fetchAllUser);

module.exports = router;
