<template>
  <view class="mine-container">
    <view class="mine-header">
      <view class="flex items-center">
        <!-- 头像 -->
        <image
          class="w-100rpx h-100rpx rounded-full"
          :src="isLogin ? userInfo!.avatar : defaultAvatar"
        />
        <!-- 用户信息 -->
        <view class="ml-20rpx">
          <!-- 已登录 -->
          <view v-if="isLogin">
            <view class="text-32rpx">
              {{ userInfo!.nickname }}
            </view>
            <view class="text-28rpx mt2">{{ userInfo?.username }}</view>
          </view>
          <!-- 未登录 -->
          <view v-else @click="navigateToLoginPage">
            <view class="login-tip">您还未登录，请先登录</view>
            <view class="w180rpx mt-2">
              <button class="login-btn" @click="navigateToLoginPage">登录</button>
            </view>
          </view>
        </view>
      </view>
      <!-- 编辑资料 -->
      <view v-if="isLogin" class="cursor-pointer">
        <wd-icon name="setting" />
      </view>
    </view>
    <!-- 功能操作 -->
    <wd-grid clickable custom-class="rounded-[10rpx] bg-white">
      <wd-grid-item text="我的消息" icon="mail" @itemclick="handleItemclick" />
      <wd-grid-item text="我的待办" icon="list" @itemclick="handleItemclick" />
      <wd-grid-item text="我的收藏" icon="star" @itemclick="handleItemclick" />
      <wd-grid-item text="浏览历史" icon="view" @itemclick="handleItemclick" />
    </wd-grid>
    <!-- 菜单列表 -->
    <view class="mt40rpx">
      <wd-cell-group border>
        <wd-cell title="关于我们" icon="info-circle" clickable @click="navigateToAbout">
          <wd-icon name="arrow-right" />
        </wd-cell>
        <wd-cell title="常见问题" icon="help-circle" @click="navigateToFAQ">
          <wd-icon name="arrow-right" />
        </wd-cell>
        <wd-cell title="问题反馈" icon="check-circle" clickable @click="navigateToAbout">
          <wd-icon name="arrow-right" />
        </wd-cell>
        <wd-cell title="设置" icon="setting1" clickable @click="navigateToSettings">
          <wd-icon name="arrow-right" />
        </wd-cell>
      </wd-cell-group>
    </view>

    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { useToast } from "wot-design-uni";
import { useUserStore } from "@/store/modules/user";

const toast = useToast();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const isLogin = computed(() => !!userInfo.value);
const defaultAvatar = "/static/images/default-avatar.png";

// 登录
const navigateToLoginPage = () => {
  uni.navigateTo({ url: "/pages/login/index" });
};
// 个人信息
const navigateToProfile = () => {
  uni.navigateTo({ url: "/pages/mine/profile/index" });
};

// 常见问题
const navigateToFAQ = () => {
  uni.navigateTo({ url: "/pages/faq/index" });
};
// 关于我们
const navigateToAbout = () => {
  uni.navigateTo({ url: "/pages/mine/about/index" });
};
// 应用设置
const navigateToSettings = () => {
  uni.navigateTo({ url: "/pages/mine/settings/index" });
};

const handleItemclick = (item: any) => {
  toast.show("建设中...");
};
</script>

<style lang="scss" scoped>
.mine-container {
  .mine-header {
    display: flex;
    align-items: start;
    justify-content: space-between;

    padding: 60rpx 20rpx;
    color: #fff;
    background: linear-gradient(60deg, #517cf0, #769ef5);

    .login-tip {
      font-size: 28rpx;
      color: #fff;
    }
    .login-btn {
      line-height: 60rpx;
      color: #4d80f0;
      background-color: #fff;
      border-radius: 10rpx;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
