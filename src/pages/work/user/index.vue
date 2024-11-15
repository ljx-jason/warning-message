<template>
  <view class="user">
    <wd-search v-model="queryParams.keywords" :maxlength="10" class="mb-2" />

    <wd-card v-for="item in dataList">
      <template #title>
        <view class="flex items-center">
          <image class="w-100rpx h-100rpx rounded-full" :src="item.avatar" />
          <view class="ml-2">
            <view class="font-bold">
              {{ item.nickname }}
              <wd-icon v-if="item.gender == 1" name="gender-male" class="color-#4D80F0" />
              <wd-icon v-else-if="item.gender == 2" name="gender-female" class="color-#fa4350" />
            </view>
            <view class="text-12px mt-1">{{ item.deptName }}</view>
          </view>
        </view>
      </template>

      <view class="flex justify-between">
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

        <view>
          <wd-img
            :width="50"
            :height="50"
            round
            :src="
              item.status == 1
                ? '@/static/images/enabled.png'
                : '../../../static/images/disabled.png'
            "
          />
        </view>
      </view>

      <template #footer>
        <view class="flex justify-between">
          <view>{{ item.createTime }}</view>
          <view>
            <wd-button size="small" plain @click="handleOpenDialog(item.id)">编辑</wd-button>
            <wd-button type="warning" size="small" plain class="ml-2">删除</wd-button>
          </view>
        </view>
      </template>
    </wd-card>

    <wd-loadmore :state="state" @reload="loadmore" />

    <wd-popup v-model="dialog.visible" position="bottom">
      <wd-form :model="formData">
        <wd-cell-group>
          <wd-cell title="昵称" title-width="200rpx">
            <wd-input v-model="formData.nickname" />
          </wd-cell>
          <wd-cell title="手机号" title-width="200rpx">
            <wd-input v-model="formData.mobile" />
          </wd-cell>
          <wd-cell title="邮箱" title-width="200rpx">
            <wd-input v-model="formData.email" />
          </wd-cell>
          <wd-cell title="状态" title-width="200rpx">
            <wd-switch v-model="formData.status" />
          </wd-cell>
        </wd-cell-group>
      </wd-form>
      <view class="footer">
        <wd-button type="primary" block @click="handleSubmit">提交</wd-button>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import UserAPI, { type UserPageQuery, UserPageVO, UserForm } from "@/api/system/user";

const state = ref<LoadMoreState>("loading"); // 加载状态 loading, finished:, error
const dataList = ref<UserPageVO[]>([]);

const queryParams: UserPageQuery = {
  pageNum: 1,
  pageSize: 10,
};

const total = ref(0); // 总数

const dialog = reactive({
  visible: false,
});

const formData = reactive<UserForm>({});

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

/**
 * 打开弹窗
 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    UserAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data });
    });
  }
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

function handleSubmit() {
  console.log("提交", formData);
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
