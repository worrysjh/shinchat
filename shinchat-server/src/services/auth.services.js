const pool = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { encryptData } = require("../utils/cryptoUtils");

// 회원가입 기능
async function registeUser(user_name, passwd) {
  //이미 존재하는 ID인지 검사
  const idCheck = await pool.query(
    `SELECT user_name FROM users WHERE user_name = $1`,
    [user_name]
  );
  if (idCheck.rows.length > 0) {
    return { success: false, message: "이미 사용중인 아이디입니다." };
  }

  const hashedPasswd = await bcrypt.hash(passwd, 10);
  await pool.query(`INSERT INTO users (user_name, passwd) values ($1, $2)`, [
    user_name,
    hashedPasswd,
  ]);

  return { success: true };
}

// 로그인 기능
async function loginUser(user_name, passwd) {
  const result = await pool.query(`SELECT * FROM users WHERE user_name = $1`, [
    user_name,
  ]);
  const user = result.rows[0];

  if (!user)
    return { success: false, message: "회원가입되지 않은 아이디입니다." };

  const match = await bcrypt.compare(passwd, user.passwd);
  if (!match) return { success: false, message: "잘못된 비밀번호 입니다." };

  const { data, iv, tag } = encryptData({
    user_id: user.user_id,
    user_name: user.user_name,
  });

  // 엑세스 토큰 생성
  const access_token = jwt.sign({ data, iv, tag }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // 리프레쉬 토큰 생성
  const refresh_token = jwt.sign(
    { data, iv, tag, type: "refresh" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const decoded = jwt.decode(refresh_token);
  const expires_at = new Date(decoded.exp * 1000);
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, payload, expires_at) VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE SET payload = $2, expires_at = $3`,
    [user.user_id, refresh_token, expires_at]
  );

  return { success: true, access_token, refresh_token };
}

// DB에 등록된 Refresh Token 확인
async function getRefreshToken(user_id, token) {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens WHERE user_id = $1 AND payload = $2`,
    [user_id, token]
  );
  return { result };
}

module.exports = { registeUser, loginUser, getRefreshToken };
