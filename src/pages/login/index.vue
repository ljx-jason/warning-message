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
  </view>
</template>

<script lang="ts" setup>
import { type LoginFormData } from "@/api/auth";
import { useUserStore } from "@/store/modules/user";

const loginFormRef = ref();

const loginFormData = ref<LoginFormData>({
  username: "admin",
  password: "123456",
});

const userStore = useUserStore();

// 登录处理
const handleLogin = () => {
  loginFormRef.value
    .validate()
    .then(async ({ valid }: { valid: boolean }) => {
      if (valid) {
        try {
          userStore.login(loginFormData.value).then(() => {
            uni.showToast({ title: "登录成功", icon: "success" });
            uni.navigateBack();
          });
        } catch (error: any) {
          console.log("登录失败", error.message);
        }
      }
    })
    .error(({ errors }: { errors: any }) => {
      console.log("errors", errors);
    });
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px);
}
</style>
