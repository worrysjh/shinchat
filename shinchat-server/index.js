const app = require("./app");
const db = require("./src/models/db");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;
const MAX_RETRIES = 5;
let client;

// 1. HTTP 서버 래핑
const server = http.createServer(app);

// 2. Socket.io 서버 생성
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 클라이언트 주소
    credentials: true,
  },
});

// 3. Socket 이벤트 처리
io.on("connection", (socket) => {
  console.log("사용자 연결됨:", socket.id);

  socket.on("join", (user_id) => {
    socket.join(user_id);
    console.log(`${user_id} 방 입장`);
  });

  socket.on("send_message", (message) => {
    console.log("메시지 전송:", message);
    io.to(message.receiver_id).emit("receive_message", message);
  });
});

// 4. DB 연결 + 서버 시작 + 재시도 로직
async function connectToDBWithExponentialBackoff(retry = 0) {
  const delay = Math.pow(2, retry) * 1000;
  try {
    client = await db.connect();
    console.log("Connected to PostgreSQL");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(
      `PostgreSQL connection failed (attempt ${retry + 1}):`,
      err.message
    );
    if (retry < MAX_RETRIES) {
      console.log(`Retrying in ${delay / 1000} seconds...`);
      setTimeout(() => connectToDBWithExponentialBackoff(retry + 1), delay);
    } else {
      console.error("All DB connection attempts failed. Exiting.");
      process.exit(1);
    }
  } finally {
    if (client) client.release();
  }
}

connectToDBWithExponentialBackoff();
