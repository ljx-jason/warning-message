<template>
  <view class="work">
    <!-- 系统管理区域 -->
    <wd-card title="系统管理">
      <wd-grid :column="4">
        <wd-grid-item v-for="(item, index) in systemManagementList" :key="index" use-slot>
          <view class="p-2">
            <image class="slot-img" :src="item.icon" />
          </view>
          <view class="text">{{ item.text }}</view>
        </wd-grid-item>
      </wd-grid>
    </wd-card>

    <!-- 系统监控区域 -->
    <wd-card title="系统监控">
      <wd-grid :column="4">
        <wd-grid-item v-for="(item, index) in systemMonitoringList" :key="index" use-slot>
          <view class="p-2">
            <image class="slot-img" :src="item.icon" />
          </view>
          <view class="text">{{ item.text }}</view>
        </wd-grid-item>
      </wd-grid>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

// 系统管理的宫格列表
const systemManagementList = reactive([
  {
    icon: "/static/icons/user.png",
    text: "用户管理",
    title: "用户管理系统",
  },
  {
    icon: "/static/icons/role.png",
    text: "角色管理",
    title: "角色管理系统",
  },
  {
    icon: "/static/icons/menu.png",
    text: "菜单管理",
    title: "菜单管理系统",
  },
  {
    icon: "/static/icons/dept.png",
    text: "部门管理",
    title: "部门管理系统",
  },
  {
    icon: "/static/icons/dict.png",
    text: "字典管理",
    title: "字典管理系统",
  },
  {
    icon: "/static/icons/config.png",
    text: "系统配置",
    title: "系统配置管理",
  },
  {
    icon: "/static/icons/notice.png",
    text: "通知公告",
    title: "通知公告管理",
  },
  {
    icon: "/static/icons/more.png",
    text: "更多模块",
    title: "更多模块管理",
  },
]);

// 系统监控的宫格列表
const systemMonitoringList = reactive([
  {
    icon: "/static/icons/monitor.png",
    text: "实时监控",
    title: "实时监控系统",
  },
  {
    icon: "/static/icons/logs.png",
    text: "日志管理",
    title: "系统日志管理",
  },
  {
    icon: "/static/icons/performance.png",
    text: "性能监控",
    title: "性能监控系统",
  },
  {
    icon: "/static/icons/alerts.png",
    text: "警报设置",
    title: "警报设置系统",
  },
]);
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}
/* stylelint-enable selector-type-no-unknown */

.work {
  padding: 20px 0;
}

.slot-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
</style>
