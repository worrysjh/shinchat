import { useState } from "react";
import { registeUser } from "../actions/authActions";
import "../styles/LoginPage.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({ user_name: "", passwd: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const { user_name, passwd } = form;
    const result = await registeUser(user_name, passwd);

    if (result.success) {
      alert("회원가입 성공 | ID : " + result.user_name);
      navigate("/login");
    } else {
      alert("회원가입 실패");
    }
  };

  return (
    <form onSubmit={onRegister}>
      <div className="login-page">
        <div className="login-card">
          <input
            name="user_name"
            placeholder="아이디"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />
          <button type="submit">회원가입</button>
          <div className="signup-box">
            * 계정이 존재하시나요? <Link to="/">로그인 하러가기</Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RegisterPage;
