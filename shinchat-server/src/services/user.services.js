const pool = require("../models/db");

async function getAllUserInfo() {
  const result = await pool.query(`SELECT user_id, user_name FROM users`);

  return result.rows;
}

module.exports = { getAllUserInfo };
