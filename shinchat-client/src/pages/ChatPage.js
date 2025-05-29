import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import "../styles/ChatPage.css";
import { authFetch } from "../utils/authFetch";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await authFetch(
        `${process.env.REACT_APP_API_URL}/users/me`,
        {},
        navigate
      );
      if (res && res.ok) {
        const user = await res.json();
        setCurrentUser(user);
      } else {
        console.error("Failed to fetch current user");
      }
    };
    fetchCurrentUser();
  }, []);

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="chat-page">
      <UserList onSelectUser={setSelectedUser} currentUser={currentUser} />
      <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
    </div>
  );
}
