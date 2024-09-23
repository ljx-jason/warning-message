const API_HOST = "https://api.youlai.tech";

export default function request<T>(options: UniApp.RequestOptions): Promise<T> {
  const token = uni.getStorageSync("token"); // 从本地缓存获取 token

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: `${API_HOST}${options.url}`,
      header: {
        ...options.header,
        Authorization: token,
      },
      success: (response) => {
        const resData = response.data as ResponseData<T>;
        // 业务状态码 00000 表示成功
        if (resData.code === "00000") {
          resolve(resData.data);
        } else {
          uni.showToast({
            title: resData.msg || "业务处理失败",
            icon: "none",
            duration: 2000,
          });
          reject({
            message: resData.msg || "业务处理失败",
            code: resData.code,
          });
        }
      },
      fail: (error) => {
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
