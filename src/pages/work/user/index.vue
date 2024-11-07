<template>
  <view class="user">
    <wd-table :data="dataList" @sort-method="handleSort">
      <wd-table-col prop="username" label="用户名" :fixed="true" width="150rpx" :sortable="true" />
      <wd-table-col prop="nickname" label="昵称" />
      <wd-table-col prop="" label="性别" width="120rpx">
        <template #value="{ row }">
          <wd-tag v-if="row.gender == 1" type="primary" mark plain>男</wd-tag>
          <wd-tag v-else-if="row.gender == 2" type="danger" mark plain>女</wd-tag>
          <wd-tag v-else mark plain>未知</wd-tag>
        </template>
      </wd-table-col>
      <wd-table-col prop="deptName" label="部门" />
      <wd-table-col prop="mobile" width="220rpx" label="手机号码" />
      <wd-table-col prop="" label="状态" width="120rpx">
        <template #value="{ row }">
          <wd-tag v-if="row.status == 1" type="success" mark plain>正常</wd-tag>
          <wd-tag v-else type="danger" mark plain>停用</wd-tag>
        </template>
      </wd-table-col>
      <wd-table-col prop="createTime" label="创建时间" />
      <wd-table-col prop="" :fixed="true" label="操作">
        <template #value="{ row }">
          <wd-text type="primary" class="cursor-pointer" text="编辑" @click="handleEdit(row)" />
          <wd-text
            type="error"
            class="ml-2 cursor-pointer"
            text="删除"
            @click="handleDelete(row)"
          />
        </template>
      </wd-table-col>
    </wd-table>

    <wd-loadmore :state="state" @reload="loadmore" />
  </view>
</template>
<script lang="ts" setup>
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import UserAPI, { type UserPageQuery, UserPageVO } from "@/api/system/user";

const state = ref<LoadMoreState>("loading"); // 加载状态 loading, finished:, error
const dataList = ref<Record<string, any>[]>([]);

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
