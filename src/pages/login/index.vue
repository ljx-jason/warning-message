<template>
  <view class="login">
    <image class="logo" src="@/static/logo.png" style="width: 100px; height: 100px" />
    <view class="mt-10 flex-center">
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
        <view class="footer">
          <wd-button size="large" type="primary" block @click="handleLogin">提交</wd-button>
        </view>
      </wd-form>
      <div class="flex justify-center mt-[100rpx]">
        <div class="flex flex-col items-center" @click="handleWechatLogin">
          <img src="/static/icons/icon_wx.png" class="w-[100rpx] h-[100rpx]" />
          <span class="mt-2">微信登录</span>
        </div>
      </div>
    </view>
    <view class="agreement-text">
      <view class="agreement-links">
        <text class="normal-text">登录即同意</text>
        <text class="link" @click="navigateToUserAgreement">《用户协议》</text>
        <text class="normal-text">和</text>
        <text class="link" @click="navigateToPrivacy">《隐私政策》</text>
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
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px);
  .agreement-text {
    position: fixed;
    right: 0;
    bottom: 30px;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;

    .agreement-links {
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 1.5;

      .normal-text {
        color: #666;
      }

      .link {
        padding: 0 2px;
        color: #2979ff;

        &:active {
          opacity: 0.8;
        }
      }
    }

    .copyright {
      display: flex;
      flex-direction: column;
      align-items: center;

      .copyright-text {
        font-size: 12px;
        line-height: 1.5;
        color: #999;
      }
    }
  }
}
</style>
