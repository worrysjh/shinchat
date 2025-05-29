const { getAllUserInfo } = require("../services/user.services");

async function fetchAllUser(req, res) {
  try {
    const result = await getAllUserInfo();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: "가입 유저 정보 조회실패" });
  }
}

async function getMyProfile(req, res) {
  try {
    const { user_id, user_name } = req.user;
    res.json({ user_id, user_name });
  } catch (err) {
    res.status(500).json({ message: "유저 정보 조회 실패" });
  }
}

module.exports = { fetchAllUser, getMyProfile };
