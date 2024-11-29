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
    </view>
    <view class="agreement-text">
      <view class="agreement-links">
        <text class="normal-text">登录即同意</text>
        <text class="link" @click="goToUserAgreement">《用户协议》</text>
        <text class="normal-text">和</text>
        <text class="link" @click="goToPrivacy">《隐私政策》</text>
      </view>
      <view class="copyright">
        <text class="copyright-text">Copyright © {{ getYear() }} 有来开源组织</text>
        <text class="copyright-text">All Rights Reserved</text>
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
const goToUserAgreement = () => {
  uni.navigateTo({
    url: "/pages/mine/user-agreement/index",
  });
};
const goToPrivacy = () => {
  uni.navigateTo({
    url: "/pages/mine/privacy/index",
  });
};
const getYear = () => {
  return new Date().getFullYear();
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
