import React, { useState } from "react";
import { loginUser } from "../actions/authActions";

function LoginPage() {
  const [user_name, setUserName] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(user_name, passwd);

    if (result.success) {
      alert("로그인 성공!");
      // 예: navigate("/profile"); 또는 home으로 이동
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={user_name}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="아이디"
      />
      <input
        type="password"
        value={passwd}
        onChange={(e) => setPasswd(e.target.value)}
        placeholder="비밀번호"
      />
      <button type="submit">로그인</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoginPage;
