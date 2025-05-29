import { useEffect, useState } from "react";
import axios from "axios";

export default function UserList({ onSelectUser, currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/all`)
      .then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="user-list">
      <h3>Users</h3>
      <ul>
        {users
          .filter((user) => user.user_id !== currentUser.user_id)
          .map((user) => (
            <li key={user.user_id} onClick={() => onSelectUser(user)}>
              {user.user_name}
            </li>
          ))}
      </ul>
    </div>
  );
}
