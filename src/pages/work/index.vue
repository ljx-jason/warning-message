<template>
  <view class="work">
    <!-- 父容器，用于包裹自闭合标签 -->
    <view class="title-with-bar-container">
      <view class="font-bold text-lg">工作</view>
      <!-- 自闭合标签 -->
      <view class="title-with-bar" />
    </view>
    <wd-grid border :column="4">
      <wd-grid-item v-for="index in 8" :key="index" use-text-slot icon="picture">
        <template #text>
          <view class="text">自定义文字插槽</view>
        </template>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>
<script lang="ts" setup>
const defaultAvatar = "/static/images/default-avatar.png";
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}
/* stylelint-enable selector-type-no-unknown */
.img {
  width: 100%;
  height: 90rpx;
}
.title-with-bar-container {
  position: relative;
  padding-left: 20px; // 留出竖杠的空间
}

.title-with-bar-container::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 100%;
  content: "";
  background-color: blue;
  border-radius: 10px; // 圆角
}
</style>
