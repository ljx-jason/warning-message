<template>
  <view class="flex-center flex-col">
    <image class="logo" src="/static/logo.png" />
    <view>
      <text class="text-red font-bold text-lg">{{ title }}</text>
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
