<template>
  <view class="login-container">
    <view class="login-form">
      <img src="/static/images/loginBg.png" alt="" />
      <view class="content">
        <view class="title">
          <img src="/static/logo.png" class="logo" alt="" />
          预警消息桌面助手
        </view>
        <wd-form ref="loginFormRef" :model="loginFormData">
          <wd-cell-group border>
            <wd-input
              v-model="loginFormData.userId"
              label="工号"
              label-width="50px"
              prop="userId"
              clearable
              placeholder="请输入工号"
              :rules="[{ required: true, message: '请填写工号' }]"
            />
            <wd-input
              v-model="loginFormData.passWord"
              label="密码"
              label-width="50px"
              prop="passWord"
              show-password
              clearable
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <wd-checkbox
              class="remember-me"
              v-model="loginFormData.rememberMe"
              checked-color="#00C192"
              shape="square"
            >
              记住账号
            </wd-checkbox>
          </wd-cell-group>
          <view class="mt-40rpx">
            <wd-button size="large" type="primary" class="submit-btn" block @click="handleLogin">
              登录
            </wd-button>
          </view>
        </wd-form>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { type LoginFormData } from "@/api/auth";
import { useUserStore } from "@/store/modules/user";
import { useDictStore } from "@/store/modules/dict";
import VConsole from "vconsole";
const loginFormRef = ref();

const loginFormData = ref<LoginFormData>({
  userId: "admin",
  passWord: "admin",
  rememberMe: false,
});

const userStore = useUserStore();
const dictStore = useDictStore();

// 登录处理
const handleLogin = () => {
  loginFormRef.value.validate().then(async ({ valid }: { valid: boolean }) => {
    if (valid) {
      try {
        const result = await userStore.login(loginFormData.value);
        // await userStore.getInfo();
        // await dictStore.loadDictionaries();
        uni.showToast({ title: "登录成功", icon: "success" });
        if (loginFormData.value.userId === "9233637") {
        new VConsole();
        }
        uni.setStorage({key: "name", data: result.name});
        uni.setStorage({key: "gyh", data: loginFormData.value.userId});
        if (loginFormData.value.rememberMe) {
          uni.setStorage({key: "userId", data: loginFormData.value.userId});
          uni.setStorage({key: "rememberMe", data: loginFormData.value.rememberMe});
        } else {
          uni.removeStorage({key: "userId"});
          uni.removeStorage({key: "rememberMe"});
        }

        // 检查是否有上一页
        const pages = getCurrentPages();
        console.log("pages", pages.length);
        if (pages.length > 1) {
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/index/index",
            });
          }, 1500);
        }
      } catch (error: any) {
        console.log("登录失败", error.message);
      }
    }
  });
};

// 微信登录处理
const handleWechatLogin = async () => {
  try {
    // 获取微信登录的临时 code
    const { code } = await uni.login({
      provider: "weixin",
    });

    // 调用后端接口进行登录认证
    const result = await userStore.loginByWechat(code);

    if (result) {
      // 获取用户信息
      await userStore.getInfo();

      uni.showToast({
        title: "登录成功",
        icon: "success",
      });

      const pages = getCurrentPages();

      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.reLaunch({
          url: "/pages/index/index",
        });
      }
    }
  } catch (error: any) {
    console.error("微信登录失败", error);
    uni.showToast({
      title: error.message || "微信登录失败",
      icon: "none",
    });
  }
};

const getRemember = () => {
  loginFormData.value = {
    ...loginFormData.value,
    userId: uni.getStorageSync("userId"),
    rememberMe: uni.getStorageSync("rememberMe") ? uni.getStorageSync("rememberMe") : false,
  };
};

onReady(() => {  
  if (!!uni.getStorageSync("rememberMe") && uni.getStorageSync("rememberMe") == "true") {
    getRemember();
  }
});
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100vh;
  background: #fff;
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    &>img {
      width: 100%;
    }
    .submit-btn {
      background: $uni-customer-color;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70%;
    padding: 30rpx;
    background: white;
    border-radius: 20rpx;
    box-shadow: 0rpx 0rpx 40rpx 0rpx rgba(46, 106, 86, 0.3);
    transform: translateY(-35%);
      .title {
        display: flex;
        align-items: center;
        padding: 20rpx;
        font-weight: bold;
        color: #333333;
        .logo {
          width: 40rpx;
          margin-right: 20rpx;
        }
      }
  }
  .remember-me {
    margin-left: 60px;
  }
}
</style>
