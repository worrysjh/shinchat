import React, { useState } from "react";
import { loginUser } from "../actions/authActions";
import "../styles/LoginPage.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [user_name, setUserName] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(user_name, passwd);

    if (result.success) {
      alert("로그인 성공");
      navigate("/chat");
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="login-page">
        <div className="login-card">
          <input
            type="text"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="아이디"
            required
          />
          <input
            type="password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            placeholder="비밀번호"
            required
          />
          <button type="submit">로그인</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="signup-box">
            * 계정이 없으신가요? <Link to="/register">회원가입하기</Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginPage;
