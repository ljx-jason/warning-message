<template>
  <view class="header">
    <view class="header-left"><img src="/static/logo.png" class="logo" alt="" />预警消息助手</view>
    <view class="header-right">
      <wd-icon name="user" color="#fff" size="44rpx" />
      <span>{{ userName }}</span>
      <img src="/static/images/back.png" @click="goBack" alt="" />
    </view>
  </view>
</template>

<script setup>
const userName = computed(() => {
  return uni.getStorageSync("name");
});
const goBack = () => {
  uni.reLaunch({
    url: "/pages/login/index",
  });
  uni.clearStorageSync()
}
</script>

<style scoped lang="scss">
.header {
  // position: sticky;
  // top: 0;
  // z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  margin-bottom: 10rpx;
  background: linear-gradient(135deg, #3C96CD 0%, #34BA9E 100%);


  &-left {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    font-size: 36rpx;
    font-weight: 600;
    color: #FFFFFF;

    .logo {
      width: 40rpx;
      margin-right: 20rpx;
    }
  }

  &-right {
    display: flex;
    align-items: center;
    height: 68px;
    margin-right: 30rpx;

    span {
      margin: 0 20rpx 0 10rpx;
      font-size: 32rpx;
      color: #FFFFFF;
    }

    img {
      width: 40rpx;
    }
  }
}
</style>
