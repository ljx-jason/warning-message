<template>
  <view class="work">
    <!-- 筛选 -->
    <wd-drop-menu
      close-on-click-modal
      class="mb-20rpx"
      style="margin-right: 20rpx; margin-left: 20rpx"
    >
      <wd-drop-menu-item
        ref="dropMenu"
        title="筛选"
        icon="filter"
        icon-size="18px"
        @opened="handleOpened"
      >
        <view>
          <wd-input
            v-model="queryParams.keywords"
            label="关键字"
            type="text"
            placeholder="请输入关键字"
          />
          <view class="flex flex-row items-center mb-20rpx">
            <wd-button class="mt-20rpx mb-20rpx" size="medium" @click="search()">查询</wd-button>
            <wd-button size="medium" type="info" @click="reset">重置</wd-button>
          </view>
        </view>
      </wd-drop-menu-item>
    </wd-drop-menu>

    <!-- 列表 -->
    <scroll-view scroll-y class="list-container">
      <view
        v-for="(item, index) in pageData"
        :key="index"
        class="card"
        style="margin: 20rpx; border-bottom: 1px solid #ccc"
        @click="itemClicked(item)"
      >
        <view class="card-content" style="padding: 20rpx; margin: 20rpx">
          <view class="item">
            <view class="title">配置名称：{{ item.configName }}</view>
            <view class="content">
              <!--              <view class="row">-->
              <!--                <view class="label">配置名称：</view>-->
              <!--                <view class="value">{{ item.configName }}</view>-->
              <!--              </view>-->
              <view class="row">
                <view class="label">配置键：</view>
                <view class="value">{{ item.configKey }}</view>
              </view>
              <view class="row">
                <view class="label">配置值：</view>
                <view class="value">{{ item.configValue }}</view>
              </view>
              <view class="row">
                <view class="label">备注：</view>
                <view class="value">{{ item.remark }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <wd-loadmore :state="state" @reload="handleQuery" />
    </scroll-view>

    <!-- 底部按钮 -->
    <view
      class="footer-buttons"
      style="
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-around;
        padding: 20rpx;
        background-color: #fff;
      "
    >
      <wd-button size="medium" type="primary" @click="add">添加</wd-button>
      <wd-button size="medium" type="success" @click="refreshCache">刷新缓存</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import ConfigAPI, { ConfigPageVO, ConfigForm, ConfigPageQuery } from "@/api/system/config";
import { DropMenuItemExpose } from "wot-design-uni/components/wd-drop-menu-item/types";
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";

const state = ref<LoadMoreState>("loading"); // 加载状态 loading, finished:, error
const loading = ref(false);
const total = ref(0);
const queryParams = reactive<ConfigPageQuery>({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
});
// 系统配置表格数据
const pageData = ref<ConfigPageVO[]>([]);
/**
 * 搜索栏
 */
const dropMenu = ref<DropMenuItemExpose>();

function search() {
  pageData.value = [];
  dropMenu.value?.close();
  handleQuery();
}

/**
 * 重置搜索条件
 */
function reset() {
  queryParams.pageNum = 1;
  queryParams.keywords = "";
  // queryParams.createTime = ["", ""];
  // timeStampArray.value = [];
  pageData.value = [];
  dropMenu.value?.close();
  handleQuery();
}

/**
 * 处理下拉菜单打开事件
 */
function handleOpened() {
  // 在这里可以添加处理下拉菜单打开时的逻辑
  console.log("下拉菜单已打开");
}

/**
 * 触底事件
 */
onReachBottom(() => {
  queryParams.pageNum++;
  handleQuery();
});

function handleQuery() {
  state.value = "loading";
  ConfigAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
      // // 计算当前已加载的条数
      // const loadedCount = queryParams.pageNum * queryParams.pageSize;
      //
      // // 判断是否需要加载下一页
      // if (loadedCount < total.value) {
      //   queryParams.pageNum++;
      //   // 调用 handleQuery 继续加载下一页
      //   handleQuery();
      // }
    })
    .finally(() => {
      state.value = "finished";
    });
}

function add() {
  // 跳转到指定页面
  uni.navigateTo({
    url: "/pages/work/system/config/item",
  });
}

function refreshCache() {
  ConfigAPI.refreshCache().then(() => {
    uni.showToast({
      title: "刷新缓存成功",
      icon: "success",
      duration: 1000, // 显示时间，单位为毫秒，设置为 0 则不会自动消失
    });
  });
}

function itemClicked(item: ConfigPageVO) {
  console.log(item);

  // 直接传递整个 item 对象
  uni.navigateTo({
    url: "/pages/work/system/config/item?item=" + encodeURIComponent(JSON.stringify(item)),
  });
}

// 新增 onShow 方法
onShow(() => {
  handleQuery(); // 重新加载数据
});

onLoad(() => {
  handleQuery();
});
</script>
<style lang="scss" scoped>
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}

/* stylelint-enable selector-type-no-unknown */

.work {
  padding: 40rpx 0;
}

::v-deep .wd-drop-menu__item {
  display: flex;
  justify-content: flex-end;
  padding: 0 50rpx;
}

.list-container {
  height: calc(100vh - 350rpx); /* 调整高度以避免被底部按钮挡住 */
  overflow-y: auto;
}

.card {
  background-color: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 10rpx;
}

.item {
  //margin-bottom: 20rpx;
}

.title {
  margin-bottom: 10rpx;
  font-weight: bold;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 10rpx;
  margin: 10rpx;
  background: #f5f5f5;
}

.row-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 0rpx; /* 调整 label 和 value 之间的间距 */
  align-items: center;
  justify-content: space-between;
  width: 100%; /* 调整宽度以适应两列布局 */
  margin-left: 20rpx;
}

.label {
  flex: 1; /* 让 label 占据剩余空间的一部分 */
  font-size: 24rpx;
}

.value {
  flex: 3; /* 让 value 占据剩余空间的大部分 */
  font-size: 22rpx;
  color: #999;
}
</style>
