const app = require("./app");
const db = require("./src/models/db");

const PORT = process.env.PORT || 4000;

// DB 연결 확인 및 실패시 재시도 로직
let client;
const MAX_RETRIES = 5;

async function connectToDBWithExponentialBackoff(retry = 0) {
  const delay = Math.pow(2, retry) * 1000;
  try {
    client = await db.connect();
    console.log("Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(
      `PostgreSQL connection failed (attempt ${retry + 1}): `,
      err.message
    );
    if (retry < MAX_RETRIES) {
      console.log(`Retrying in ${delay / 1000} seconds...`);
      setTimeout(() => connectToDBWithExponentialBackoff(retry + 1), delay);
    } else {
      console.error("All DB connection attemps failed. Exiting");
      process.exit(1);
    }
  } finally {
    if (client) client.release();
  }
}

connectToDBWithExponentialBackoff();
