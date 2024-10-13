const TOKEN_KEY = "app-token";

function getToken(): string {
  return uni.getStorageSync(TOKEN_KEY) || "";
}

function setToken(token: string) {
  return uni.setStorageSync(TOKEN_KEY, token);
}

function clearToken() {
  return uni.removeStorageSync(TOKEN_KEY);
}

function isLogin(): boolean {
  return !!getToken();
}

export { getToken, setToken, clearToken, isLogin };
