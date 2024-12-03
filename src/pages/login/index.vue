<template>
  <view class="login-container">
    <view class="login-header">
      <image src="/static/images/youlaiorg.png" class="w160rpx h160rpx" />
      <view class="text-sm text-white">有来开源，致力于构建高效开发的应用解决方案。</view>
    </view>

    <view class="login-form">
      <wd-form ref="loginFormRef" :model="loginFormData">
        <wd-cell-group border>
          <wd-input
            v-model="loginFormData.username"
            label="用户名"
            label-width="100px"
            prop="username"
            clearable
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <wd-input
            v-model="loginFormData.password"
            label="密码"
            label-width="100px"
            prop="password"
            show-password
            clearable
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </wd-cell-group>
        <view class="mt-80rpx">
          <wd-button size="large" type="primary" block @click="handleLogin">登录</wd-button>
        </view>
      </wd-form>
    </view>

    <view class="login-footer">
      <view class="text-center">
        <wd-divider>
          <img src="/static/icons/icon_wx.png" class="w-[100rpx] h-[100rpx]" />
        </wd-divider>
      </view>
      <view class="text-center mt-20rpx">
        <text class="text-medium-light">登录即同意</text>
        <text @click="navigateToUserAgreement">《用户协议》</text>
        <text class="text-medium-light">和</text>
        <text @click="navigateToPrivacy">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { type LoginFormData } from "@/api/auth";
import { useUserStore } from "@/store/modules/user";
import { useDictStore } from "@/store/modules/dict";
const loginFormRef = ref();

const loginFormData = ref<LoginFormData>({
  username: "admin",
  password: "123456",
});

const userStore = useUserStore();
const dictStore = useDictStore();
// 登录处理
const handleLogin = () => {
  loginFormRef.value.validate().then(async ({ valid }: { valid: boolean }) => {
    if (valid) {
      try {
        await userStore.login(loginFormData.value);
        await userStore.getInfo();
        await dictStore.loadDictionaries();
        uni.showToast({ title: "登录成功", icon: "success" });
        uni.reLaunch({
          url: "/pages/index/index",
        });
      } catch (error: any) {
        console.log("登录失败", error.message);
      }
    }
  });
};

const navigateToUserAgreement = () => {
  uni.navigateTo({
    url: "/pages/mine/user-agreement/index",
  });
};
const navigateToPrivacy = () => {
  uni.navigateTo({
    url: "/pages/mine/privacy/index",
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
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
  margin: 0; /* 移除默认的外边距 */
}
.login-container {
  position: relative;
  height: 100vh;
  background: #fff;
  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 160rpx 0;
    background: url("/static/images/login-banner.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .login-form {
    width: 80%;
    margin: 80rpx auto;
  }

  .login-footer {
    position: absolute;
    bottom: 40rpx;
    width: 100%;
  }
}
</style>
