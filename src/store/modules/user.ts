import { defineStore } from "pinia";
import AuthAPI from "@/api/auth";
import UserAPI, { UserInfo } from "@/api/user";
import { setToken, clearToken } from "@/utils/auth";

export const useUserStore = defineStore("user", () => {
  // 确保 token 是响应式的
  const token = ref<string>(uni.getStorageSync("token") || "");
  const userInfo = ref<UserInfo | null>(null);

  // 登录
  const login = (username: string, password: string) => {
    AuthAPI.login(username, password)
      .then((res) => {
        token.value = ` ${res.accessToken}`; // Bearer token
        setToken(token.value);
      })
      .catch((error) => {
        if (error.action === "TOKEN_INVALID") {
          // 处理 Token 失效，比如弹出登录提示框，而不是直接跳转
          console.log("Token 已失效，请重新登录");
          // 例如：uni.navigateTo({ url: '/pages/login/index' });
        } else {
          // 处理其他错误
          console.error("请求失败", error.message);
        }
      });
  };

  // 获取用户信息
  const getUserInfo = async () => {
    const info = await UserAPI.getUserInfo();
    userInfo.value = info;
  };

  // 登出
  const logout = async () => {
    await AuthAPI.logout();
    userInfo.value = null;
    token.value = ""; // 清空 token
    clearToken(); // 从本地缓存移除 token
  };

  return {
    token,
    userInfo,
    login,
    logout,
    getUserInfo,
  };
});
