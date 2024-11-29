<template>
  <view class="mine">
    <!-- 个人资料 -->
    <view class="header">
      <view class="flex items-center">
        <image
          class="w-100rpx h-100rpx rounded-full"
          :src="isLogin ? userInfo!.avatar : defaultAvatar"
        />
        <view class="ml-20rpx text-32rpx">
          <text v-if="isLogin">{{ userInfo!.nickname }}</text>
          <view v-else @click="goToLoginPage">
            <text>您还未登录，请先</text>
            <text class="cursor-pointer">
              登录
              <wd-icon name="arrow-right" />
            </text>
          </view>
        </view>
      </view>
      <view>
        <text v-if="isLogin" class="cursor-pointer" @click="goToProfile">
          个人信息
          <wd-icon name="arrow-right" />
        </text>
      </view>
    </view>
    <view class="relative -top-[50px] p-[40rpx]">
      <!-- 功能操作 -->
      <wd-grid clickable class="rounded-[10rpx] bg-white">
        <wd-grid-item :to="{ path: '/group' }" icon="setting" text="交流群" />
        <wd-grid-item :to="{ path: '/customer-service' }" icon="setting" text="在线客服" />
        <wd-grid-item :to="{ path: '/feedback' }" icon="setting" text="反馈社区" />
        <wd-grid-item :to="{ path: '/like-us' }" icon="setting" text="点赞我们" />
      </wd-grid>
      <!-- 菜单列表 -->
      <view class="mt50rpx">
        <wd-cell-group border>
          <wd-cell title="常见问题" icon="help-circle" @click="goToFAQ">
            <wd-icon name="arrow-right" />
          </wd-cell>
          <wd-cell title="关于我们" icon="warning" clickable @click="goToAbout">
            <wd-icon name="arrow-right" />
          </wd-cell>
          <wd-cell title="用户协议" icon="user" clickable @click="goToUserAgreement">
            <wd-icon name="arrow-right" />
          </wd-cell>
          <wd-cell title="隐私政策" icon="folder" clickable @click="goToPrivacy">
            <wd-icon name="arrow-right" />
          </wd-cell>
          <wd-cell title="网络检测" icon="wifi" clickable @click="goToNetworkTest">
            <wd-icon name="arrow-right" />
          </wd-cell>
          <wd-cell
            title="清除缓存"
            icon="delete"
            :value="cacheSize"
            clickable
            @click="handleClearCache"
          />
          <wd-cell title="应用设置" icon="setting" clickable @click="goToSettings">
            <wd-icon name="arrow-right" />
          </wd-cell>
          <wd-cell title="退出登录" icon="logout" clickable @click="handleLogout">
            <wd-icon name="arrow-right" />
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>
    <!-- 全屏 loading -->
    <view v-if="clearing" class="loading-mask">
      <view class="loading-content">
        <view class="loading-icon" />
        <text class="loading-text">正在清理...</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const isLogin = computed(() => !!userInfo.value);
const defaultAvatar = "/static/images/default-avatar.png";

// 登录
const goToLoginPage = () => {
  uni.navigateTo({ url: "/pages/login/index" });
};
// 个人信息
const goToProfile = () => {
  uni.navigateTo({ url: "/pages/mine/profile/index" });
};

// 用户协议
const goToUserAgreement = () => {
  uni.navigateTo({ url: "/pages/mine/user-agreement/index" });
};
// 隐私政策
const goToPrivacy = () => {
  uni.navigateTo({ url: "/pages/mine/privacy/index" });
};
// 网络测试
const goToNetworkTest = () => {
  uni.navigateTo({ url: "/pages/mine/network-test/index" });
};
// 常见问题
const goToFAQ = () => {
  uni.navigateTo({ url: "/pages/faq/index" });
};
// 关于我们
const goToAbout = () => {
  uni.navigateTo({ url: "/pages/mine/about/index" });
};
// 应用设置
const goToSettings = () => {
  uni.showToast({
    title: "建设中...",
    icon: "none",
  });
  //uni.navigateTo({ url: "/pages/settings/index" });
};
// 退出登录
const handleLogout = () => {
  userStore.logout().then(() => {
    uni.showToast({ title: "已退出登录", icon: "success" });
  });
};
// 是否正在清理
const clearing = ref(false);
// 缓存大小
const cacheSize = ref<any>("计算中...");
// 获取缓存大小
const getCacheSize = async () => {
  try {
    // #ifdef MP-WEIXIN
    const res = await uni.getStorageInfo();
    cacheSize.value = formatSize(res.currentSize);
    // #endif
    // #ifdef H5
    cacheSize.value = formatSize(
      Object.keys(localStorage).reduce((size, key) => size + localStorage[key].length, 0)
    );
    // #endif
    if (!cacheSize.value) {
      cacheSize.value = "0B";
    }
  } catch (error) {
    console.error("获取缓存大小失败:", error);
    cacheSize.value = "获取失败";
  }
};

// 格式化存储大小
const formatSize = (size: number) => {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else {
    return (size / 1024 / 1024).toFixed(2) + "MB";
  }
};

// 处理清除缓存
const handleClearCache = async () => {
  if (cacheSize.value === "获取失败") {
    uni.showToast({
      title: "获取缓存信息失败，请稍后重试",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  if (cacheSize.value === "0B") {
    uni.showToast({
      title: "暂无缓存需要清理",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  if (clearing.value) {
    return;
  }

  try {
    clearing.value = true;
    // 模拟清理过程
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // 清除缓存
    await uni.clearStorage();
    // 更新缓存大小显示
    await getCacheSize();
    // 提示清理成功
    uni.showToast({
      title: "清理成功",
      icon: "success",
    });
  } catch (error) {
    uni.showToast({
      title: "清理失败",
      icon: "error",
    });
  } finally {
    clearing.value = false;
  }
};
onShow(() => {
  getCacheSize();
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}
/* stylelint-enable selector-type-no-unknown */

.mine {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 50rpx 20rpx 100rpx 20rpx;
    color: #fff;
    background: linear-gradient(60deg, #165dff, #6aa1ff);
  }
}
.loading-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);

  .loading-content {
    padding: 30rpx 40rpx;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 12rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);

    .loading-icon {
      width: 60rpx;
      height: 60rpx;
      margin: 0 auto 20rpx;
      border: 4rpx solid #f3f3f3;
      border-top: 4rpx solid #409eff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
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
