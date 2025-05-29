import React, { useState } from "react";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import "../styles/ChatPage.css";

export default function ChatPage({ currentUser }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="chat-page">
      <UserList onSelectUser={setSelectedUser} currentUser={currentUser} />
      <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
    </div>
  );
}
