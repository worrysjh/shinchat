export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  return fetch(`${process.env.REACT_APP_API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
