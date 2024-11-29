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
      登录即同意
      <text class="link" clickable @click="goToUserAgreement">《用户协议》</text>
      和
      <text class="link" clickable @click="goToPrivacy">《隐私政策》</text>
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
        await userStore.login(loginFormData.value); // 等待登录和获取用户信息完成
        await userStore.getInfo(); // 等待用户信息获取完成
        await dictStore.loadDictionaries(); // 等待字典数据加载完成
        uni.showToast({ title: "登录成功", icon: "success" });
        const pages = getCurrentPages(); // 获取当前的页面栈

        console.log("pages", pages);
        if (pages.length > 1) {
          // 如果页面栈中有多个页面，则可以返回上一页
          uni.navigateBack();
        } else {
          // 如果页面栈中只有一个页面（通常是首页），则可以跳转到指定页面，避免 navigateBack 无法返回的问题
          uni.reLaunch({
            url: "/pages/index/index", // 替换为你想要跳转的页面路径
          });
        }
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
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px);
}
.agreement-text {
  position: fixed;
  bottom: 30px;
  width: 100%;
  margin-top: 20px;
  font-size: 12px;
  color: #666;
  text-align: center;

  .link {
    color: #2979ff;
    cursor: pointer;
  }
}
</style>
