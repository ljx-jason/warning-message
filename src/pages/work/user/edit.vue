<template>
  <view> 编辑用户，ID:{{ id }} </view>
</template>

<script lang="ts" setup>
// uniapp 获取url参数 id  不使用vue-router

const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const options = (currentPage as any).options;
const id = ref(options.id);
console.log("ID:", id);
</script>
