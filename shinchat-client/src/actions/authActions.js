import axios from "axios";

export async function loginUser(user_name, passwd) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      { user_name, passwd },
      { withCredentials: true } // refresh_token 쿠키 저장용
    );

    const { access_token } = response.data;

    // access_token 저장 (localStorage or Recoil 등)
    localStorage.setItem("access_token", access_token);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "로그인 실패",
    };
  }
}

export async function registeUser(user_name, passwd) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/register`,
      { user_name, passwd }
    );
    return { success: true, user_name: response.data.user_name };
  } catch (err) {
    return { success: false };
  }
}
