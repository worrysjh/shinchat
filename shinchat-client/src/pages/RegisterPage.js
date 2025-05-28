import { useState } from "react";
import { registeUser } from "../actions/authActions";

function RegisterPage() {
  const [form, setForm] = useState({ user_name: "", passwd: "" });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const { user_name, passwd } = form;
    const result = await registeUser(user_name, passwd);

    if (result.success) {
      alert("회원가입 성공 | ID : " + result.user_name);
    } else {
      alert("회원가입 실패");
    }
  };

  return (
    <form onSubmit={onRegister}>
      <input
        name="user_name"
        placeholder="아이디"
        onChange={handleChange}
        required
      />
      <input
        name="passwd"
        placeholder="비밀번호"
        onChange={handleChange}
        required
      />
      <button type="submit">회원가입</button>
    </form>
  );
}

export default RegisterPage;
