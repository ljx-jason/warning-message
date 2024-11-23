<template>
  <view class="work">
    <!-- 筛选 -->
    <wd-drop-menu close-on-click-modal class="mb-20rpx mr-20rpx ml-20rpx">
      <wd-drop-menu-item ref="dropMenu" title="筛选" icon="filter" icon-size="18px">
        <view>
          <wd-input
            v-model="queryParams.keywords"
            label="关键字"
            type="text"
            clearable
            placeholder="请输入关键字"
          />
          <view class="flex flex-row items-center mb-20rpx">
            <wd-button class="mt-20rpx mb-20rpx" size="medium" @click="search()">查询</wd-button>
            <wd-button size="medium" type="info" @click="reset">重置</wd-button>
          </view>
        </view>
      </wd-drop-menu-item>
    </wd-drop-menu>

    <view class="mt-20rpx">
      <!-- 列表内容 -->
      <view v-for="(item, index) in pageData" :key="index" class="mb-20rpx">
        <wd-card>
          <template #title>
            <view class="flex items-center justify-between">
              <view class="flex-1 text-truncate">{{ item.configName }}</view>
            </view>
          </template>

          <wd-row class="mb-20rpx">
            <wd-col :span="24">
              <wd-col :span="5">
                <view>配置键：</view>
              </wd-col>
              <wd-col :span="19">
                <view>{{ item.configKey || "-" }}</view>
              </wd-col>
            </wd-col>
            <wd-col :span="24">
              <wd-col :span="5">
                <view>配置值：</view>
              </wd-col>
              <wd-col :span="19">
                <view>{{ item.configValue || "-" }}</view>
              </wd-col>
            </wd-col>
            <wd-col :span="24">
              <wd-col :span="5">
                <view>备注：</view>
              </wd-col>
              <wd-col :span="19">
                <view>{{ item.remark || "-" }}</view>
              </wd-col>
            </wd-col>
          </wd-row>

          <template #footer>
            <view class="flex justify-end pr-20rpx">
              <wd-button size="small" type="primary" @click="handleAction(item)">操作</wd-button>
            </view>
          </template>
        </wd-card>
      </view>
    </view>

    <!-- 加载更多 -->
    <wd-loadmore :state="state" @reload="handleQuery" />

    <!-- 底部按钮 -->
    <view class="fixed bottom-0 left-0 right-0 flex justify-around p-20rpx bg-#fff">
      <wd-button size="medium" type="primary" @click="add">添加</wd-button>
      <wd-button size="medium" type="success" @click="refreshCache">刷新缓存</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import ConfigAPI, { ConfigPageVO, ConfigForm, ConfigPageQuery } from "@/api/system/config";
import { DropMenuItemExpose } from "wot-design-uni/components/wd-drop-menu-item/types";
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import { debounce } from "@/utils/commonUtil";
const state = ref<LoadMoreState>("loading"); // 加载状态 loading, finished:, error
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

/**
 * 搜索
 */
function search() {
  pageData.value = [];
  dropMenu.value?.close();
  queryParams.pageNum = 1;
  handleQuery();
}

/**
 * 重置搜索条件
 */
function reset() {
  queryParams.pageNum = 1;
  queryParams.keywords = "";
  pageData.value = [];
  dropMenu.value?.close();
  handleQuery();
}

/**
 * 触底事件
 */
onReachBottom(() => {
  queryParams.pageNum++;
  handleQuery();
});

/**
 * 查询
 */
function handleQuery() {
  state.value = "loading";
  ConfigAPI.getPage(queryParams)
    .then((data) => {
      if (queryParams.pageNum === 1) {
        pageData.value = data.list;
      } else {
        pageData.value.push(...data.list);
      }
      total.value = data.total;
    })
    .finally(() => {
      state.value = "finished";
    });
}

/**
 * 添加
 */
function add() {
  uni.navigateTo({
    url: "/pages/work/config/edit",
  });
}

/**
 * 刷新缓存
 */
const refreshCache = debounce(() => {
  ConfigAPI.refreshCache().then(() => {
    uni.showToast({
      title: "刷新缓存成功",
      icon: "success",
      duration: 1000, // 显示时间，单位为毫秒，设置为 0 则不会自动消失
    });
  });
}, 1000);

/**
 * 编辑
 */
function handleEdit(item: ConfigPageVO) {
  // 直接传递整个 item 对象
  uni.navigateTo({
    url: "/pages/work/config/edit?item=" + encodeURIComponent(JSON.stringify(item)),
  });
}

/**
 * 删除
 */
function handleDelete(item: ConfigPageVO) {
  uni.showModal({
    title: "提示",
    content: "确定要删除该配置吗？",
    success: async (res) => {
      if (res.confirm) {
        if (item.id) {
          ConfigAPI.deleteById(item.id).then(() => {
            uni.showToast({ title: "删除成功", icon: "success" });
          });
        }
      }
    },
  });
}

/**
 * 操作
 */
function handleAction(item: ConfigPageVO) {
  const actions = ["编辑", "删除"];
  uni.showActionSheet({
    itemList: actions,
    success: ({ tapIndex }) => {
      switch (actions[tapIndex]) {
        case "编辑":
          handleEdit(item);
          break;
        case "删除":
          handleDelete(item);
          break;
      }
    },
  });
}

onMounted(() => {
  handleQuery();
});

/**
 * 页面返回回来也要重新加载数据
 */
onLoad(() => {
  queryParams.pageNum = 1;
  handleQuery();
});
</script>
