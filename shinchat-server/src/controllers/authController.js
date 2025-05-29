const jwt = require("jsonwebtoken");
const {
  registeUser,
  loginUser,
  getRefreshToken,
} = require("../services/auth.services");

// 회원가입
async function register(req, res) {
  const { user_name, passwd } = req.body;

  try {
    const result = await registeUser(user_name, passwd);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    res.status(201).json({ success: true, user_name: result.user_name });
  } catch (err) {
    res.status(500).json({ message: "회원가입 실패" });
  }
}

// 로그인
async function login(req, res) {
  const { user_name, passwd } = req.body;
  console.log("user id: " + user_name + " / passwd: " + passwd);

  try {
    const result = await loginUser(user_name, passwd);
    if (!result.success)
      return res.status(400).json({ message: result.message });
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameStie: "Strict",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });
    res.json({ message: "로그인 성공", access_token: result.access_token });
  } catch (err) {
    res.status(500).json({ message: "로그인 실패" });
  }
}

// 엑세스 토큰 재발급
async function refreshToken(req, res) {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ message: "Refresh Token 없음" });

  try {
    // 리프레쉬 토큰 검증
    const decoded = jwt.vertify(token, process.env.REFRESH_TOKEN_SECRET);
    const { data, iv, tag } = decoded;

    // DB에 저장된 토큰과 일치하는지 검사
    const result = await getRefreshToken(data.user_id, token);
    if (result.rowCount === 0)
      return res
        .status(403)
        .json({ message: "유효하지 않은 Refresh Token입니다." });

    const newAccessToken = jwt.sign({ data, iv, tag }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ access_token: newAccessToken });
  } catch (err) {
    // 검증 실패시 토큰 갱신 실패처리 및 쿠키에서 삭제
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(403).json({ message: "토큰 갱신 실패" });
  }
}

module.exports = { register, login, refreshToken };
