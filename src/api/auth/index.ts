import request from "@/utils/request";

const AuthAPI = {
  /**
   * 登录接口
   *
   * @param userId 用户名
   * @param passWord 密码
   */
  login(data: LoginFormData) {
    return request({
      url: "/warningLogin",
      method: "GET",
      data: data,
    });
  },

  /**
   * 微信登录接口
   *
   * @param code 微信登录code
   * @returns 返回 token
   */
  wechatLogin(code: string){
    return request({
      url: "/api/v1/auth/wechat-login",
      method: "POST",
      data: { code },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  /**
   * 登出接口
   */
  logout(): Promise<void> {
    return request({
      url: "/api/v1/auth/logout",
      method: "DELETE",
    });
  },
};

export default AuthAPI;

export interface LoginFormData {
  userId: string;
  passWord: string;
  rememberMe: boolean;
}
