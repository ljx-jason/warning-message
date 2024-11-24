import { getToken, clearAll } from "@/utils/cache";
import { ResultCodeEnum } from "@/enums/ResultCodeEnum";

export default function request<T>(options: UniApp.RequestOptions): Promise<T> {
  // H5 使用 VITE_APP_BASE_API 作为代理路径，其他平台使用 VITE_APP_API_URL 作为请求路径
  let baseApi = import.meta.env.VITE_APP_API_URL;
  // #ifdef H5
  baseApi = import.meta.env.VITE_APP_BASE_API;
  // #endif

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: `${baseApi}${options.url}`,
      header: {
        ...options.header,
        Authorization: getToken() ? `Bearer ${getToken()}` : "",
      },
      data: handleData(options.data, options.method || "GET"),
      success: (response) => {
        console.log("success response", response);
        const resData = response.data as ResponseData<T>;

        // 业务状态码 00000 表示成功
        if (resData.code === ResultCodeEnum.SUCCESS) {
          resolve(resData.data);
        }
        // 令牌失效或过期处理
        else if (resData.code === ResultCodeEnum.TOKEN_INVALID) {
          console.log("令牌失效或过期处理");
          clearAll();
          // 跳转到登录页
          uni.reLaunch({
            url: "/pages/login/index",
          });
        } else {
          // 其他业务处理失败
          uni.showToast({
            title: resData.msg || "业务处理失败",
            icon: "none",
          });
          reject({
            message: resData.msg || "业务处理失败",
            code: resData.code,
          });
        }
      },
      fail: (error) => {
        console.log("fail error", error);
        uni.showToast({
          title: "网络请求失败",
          icon: "none",
          duration: 2000,
        });
        reject({
          message: "网络请求失败",
          error,
        });
      },
    });
  });
}

/**
 * 处理请求数据
 * @param data 请求数据
 * @returns 处理后的数据
 */
function handleData(data: any, method: string) {
  // 非微信小程序，且非GET请求，则不处理数据
  const appInfo = uni.getAppBaseInfo();
  if (method !== "GET" && appInfo.hostName !== "WeChat") {
    return data;
  }
  if (!data) return data;

  // 如果是对象，遍历处理每个属性
  if (typeof data === "object") {
    const result: Record<string, any> = {};
    for (const key in data) {
      const value = data[key];
      if (Array.isArray(value)) {
        let res = handleArray(value);
        if (res) {
          result[key] = res;
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return data;
}

/**
 * 处理数组
 * @param value 数组
 * @returns 逗号分隔字符串
 */
function handleArray(value: any[]) {
  let str = "";
  for (const item of value) {
    if (item != 0 && item) {
      str += `${item},`;
    }
  }
  return str;
}
