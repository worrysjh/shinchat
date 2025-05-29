import { useEffect, useState } from "react";
import { socket } from "../utils/socket";

export default function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!selectedUser) return;

    //fetch previous messages
    fetch(`${process.env.REACT_APP_API_URL}/messages/${selectedUser.user_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    const message = {
      sender_id: currentUser.user_id,
      receiver_id: selectedUser.user_id,
      content,
    };

    socket.emit("send_message", message);
    setMessages((prev) => [...prev, message]);
    setContent("");
  };

  if (!selectedUser)
    return <div className="chat-window">대화할 사용자를 선택하세요.</div>;

  return (
    <div className="chat-window">
      <h3>{selectedUser.user_name}와의 대화</h3>
      <div className="message-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              messages.sender_id === currentUser.user_id
                ? "my-msg"
                : "their-msg"
            }
          >
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="메시지 입력..."
      />
      <button onClick={sendMessage}>보내기</button>
    </div>
  );
}
