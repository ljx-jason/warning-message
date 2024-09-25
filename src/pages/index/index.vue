<template>
  <view class="flex-center flex-col">
    <image class="logo" src="/static/logo.png" />
    <view>
      <text class="text-blue font-bold text-lg">{{ title }}</text>
    </view>

    <view class="mt-5 flex-center">
      <text class="text-green font-bold text-lg">测试 UnoCSS</text>
    </view>

    <view class="mt-5 flex-center">
      <wd-button size="small">主要按钮</wd-button>
      <wd-button type="success" size="small">成功按钮</wd-button>
      <wd-button type="info" size="small">信息按钮</wd-button>
      <wd-button type="warning" size="small">警告按钮</wd-button>
      <wd-button type="error" size="small">危险按钮</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
const title = ref("Hello YouLai APP");
</script>

<style>
.logo {
  width: 200rpx;
  height: 200rpx;
  margin-top: 200rpx;
  margin-right: auto;
  margin-bottom: 50rpx;
  margin-left: auto;
}
</style>
