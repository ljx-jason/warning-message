<template>
  <view class="user">
    <wd-search v-model="queryParams.keywords" :maxlength="10" class="mb-2" />

    <wd-card v-for="item in dataList">
      <template #title>
        <view class="flex justify-between">
          <view class="flex items-center">
            <image class="w-100rpx h-100rpx rounded-full" :src="item.avatar" />
            <view class="ml-2">
              <view class="font-bold">{{ item.nickname }}</view>
              <view class="text-12px mt-1">{{ item.deptName }}</view>
            </view>
          </view>
          <view>{{ item.createTime }}</view>
        </view>
      </template>

      <view>
        <view class="flex items-center">
          <wd-icon name="usergroup" size="16" class="mr-1" />
          <view>{{ item.roleNames }}</view>
        </view>

        <view class="flex items-center">
          <wd-icon name="mobile" size="16" class="mr-1" />
          <view>{{ item.mobile }}</view>
        </view>
        <view class="flex items-center">
          <wd-icon name="mail" size="16" class="mr-1" />
          <view>{{ item.email }}</view>
        </view>
      </view>

      <template #footer>
        <wd-button size="small" plain>编辑</wd-button>
        <wd-button type="warning" size="small" plain class="ml-2">删除</wd-button>
      </template>
    </wd-card>

    <wd-loadmore :state="state" @reload="loadmore" />
  </view>
</template>
<script lang="ts" setup>
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import UserAPI, { type UserPageQuery, UserPageVO } from "@/api/system/user";

const state = ref<LoadMoreState>("loading"); // 加载状态 loading, finished:, error
const dataList = ref<UserPageVO[]>([]);

const queryParams: UserPageQuery = {
  pageNum: 1,
  pageSize: 10,
};

const total = ref(0); // 总数

onReachBottom(() => {
  if (queryParams.pageNum * queryParams.pageSize < total.value) {
    loadmore();
  } else if (queryParams.pageNum * queryParams.pageSize >= total.value) {
    state.value = "finished";
  }
});

function loadmore() {
  state.value = "loading";
  UserAPI.getPage(queryParams)
    .then((data) => {
      dataList.value = data.list;
      total.value = data.total;
      queryParams.pageNum++;
    })
    .finally(() => {
      state.value = "finished";
    });
}

/**
 * 排序
 */
function handleSort() {
  dataList.value = dataList.value?.reverse();
}

function handleEdit(row: UserPageVO) {
  console.log("编辑", row);
  uni.navigateTo({
    url: `/pages/work/user/edit?id=${row.id}`,
  });
}

function handleDelete(row: UserPageVO) {
  console.log("删除", row);
}

onLoad(() => {
  loadmore();
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}
/* stylelint-enable selector-type-no-unknown */

.custom-class {
  display: flex;
  flex-direction: col;
  align-items: center;
  width: 220rpx;
  height: 80rpx;
}
</style>
