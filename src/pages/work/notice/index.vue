<template>
  <view class="notice-container">
    <!-- 添加搜索栏 -->
    <wd-drop-menu close-on-click-modal class="mb-20rpx">
      <wd-drop-menu-item
        ref="dropMenu"
        title="筛选"
        icon="filter"
        icon-size="18px"
        @opened="handleSearch"
      >
        <view>
          <wd-input
            v-model="queryParams.title"
            label="关键字"
            type="text"
            placeholder="请输入关键字"
          />

          <view class="flex flex-row items-center mb-20rpx">
            <wd-button class="mt-20rpx mb-20rpx" size="medium" @click="handleSearch()">
              查询
            </wd-button>
            <wd-button size="medium" type="info" @click="reset">重置</wd-button>
          </view>
        </view>
      </wd-drop-menu-item>
    </wd-drop-menu>

    <!-- 列表内容 -->
    <view v-for="(item, index) in dataList" :key="index" class="mb-20rpx">
      <wd-card>
        <template #title>
          <view class="flex items-center justify-between">
            <view class="flex-1 text-truncate">{{ item.title }}</view>
            <wd-tag :type="getStatusType(item.publishStatus)" size="small">
              {{ getStatusText(item.publishStatus) }}
            </wd-tag>
          </view>
        </template>
        <view class="notice-content">
          <wd-row>
            <wd-col :span="12">
              <view class="flex">
                <text class="label">通告目标类型：</text>
                <text class="value">{{ item.targetType === 1 ? "指定" : "全体" }}</text>
              </view>
            </wd-col>
            <wd-col :span="12">
              <view class="flex">
                <text class="label">发布时间：</text>
                <text class="value">{{ formatDate(item.publishTime) }}</text>
              </view>
            </wd-col>
          </wd-row>
        </view>
        <view class="notice-content">
          <wd-row>
            <wd-col :span="12">
              <view class="flex">
                <text class="label">发布人：</text>
                <text class="value">{{ item.publisherName || "-" }}</text>
              </view>
            </wd-col>
            <wd-col :span="12">
              <view class="flex">
                <text class="label">发布时间：</text>
                <text class="value">{{ formatDate(item.publishTime) }}</text>
              </view>
            </wd-col>
          </wd-row>
        </view>
        <template #footer>
          <view class="flex justify-end gap-20rpx">
            <wd-button size="small" plain @click="handleView(item)">查看详情</wd-button>
            <wd-button
              v-if="item.publishStatus === 0"
              size="small"
              type="primary"
              @click="handleAction(item)"
            >
              更多操作
            </wd-button>
          </view>
        </template>
      </wd-card>

      <wd-loadmore :state="loadState" @reload="loadMore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import NoticeAPI, { NoticePageQuery, NoticePageVO } from "@/api/system/notice";
const loadState = ref<LoadMoreState>("finished");
const dataList = ref<NoticePageVO[]>([]);
const total = ref(0);
// 添加新的响应式数据
const statusOptions = [
  { value: "", label: "全部状态" },
  { value: 0, label: "未发布" },
  { value: 1, label: "已发布" },
  { value: -1, label: "已撤回" },
];

// 修改查询参数
const queryParams = ref<NoticePageQuery>({
  pageNum: 1,
  pageSize: 10,
  title: "",
  publishStatus: undefined,
});

// 添加搜索处理函数
const handleSearch = () => {
  queryParams.value.pageNum = 1;
  loadMore();
};

// 重置
const reset = () => {
  queryParams.value = { ...queryParams.value, pageNum: 1 };
  loadMore();
};

// 监听筛选变化
watch(
  () => [queryParams.value.publishStatus],
  () => {
    queryParams.value.pageNum = 1;
    loadMore();
  }
);

// 获取状态样式
const getStatusType = (status: number): string => {
  const statusMap: Record<number, string> = {
    0: "primary",
    1: "danger",
    [-1]: "warning",
  };
  return statusMap[status] || "default";
};

// 获取状态文本
const getStatusText = (status: number): string => {
  const statusMap: Record<number, string> = {
    0: "未发布",
    1: "已发布",
    [-1]: "已撤回",
  };
  return statusMap[status] || "未知";
};

// 格式化日期
const formatDate = (date: string): string => {
  return date ? date.split(" ")[0] : "-";
};

// 加载更多
const loadMore = async () => {
  if (loadState.value === "loading") return;

  loadState.value = "loading";
  try {
    const { list, total: totalCount } = await NoticeAPI.getPage(queryParams.value);

    if (queryParams.value.pageNum === 1) {
      dataList.value = list;
    } else {
      dataList.value = [...dataList.value, ...list];
    }

    total.value = totalCount;
    queryParams.value.pageNum++;

    loadState.value = dataList.value.length >= total.value ? "finished" : "loading";
  } catch (error) {
    loadState.value = "error";
    uni.showToast({ title: "加载失败", icon: "none" });
  }
};

// 查看详情
const handleView = (notice: NoticePageVO) => {
  uni.navigateTo({
    url: `/pages/work/notice/detail?id=${notice.id}`,
  });
};

// 操作按钮
const handleAction = (notice: NoticePageVO) => {
  const actions = notice.publishStatus === 0 ? ["编辑", "删除", "发布"] : ["撤回"];
  uni.showActionSheet({
    itemList: actions,
    success: ({ tapIndex }) => {
      switch (actions[tapIndex]) {
        case "编辑":
          handleEdit(notice);
          break;
        case "删除":
          handleDelete(notice);
          break;
        case "发布":
          // 处理发布逻辑
          break;
        case "撤回":
          uni.showModal({
            title: "提示",
            content: "确定要撤回该通知吗？",
            success: async (res) => {
              if (res.confirm) {
                try {
                  await NoticeAPI.revoke(Number(notice.id));
                  uni.showToast({
                    title: "撤回成功",
                    icon: "success",
                  });
                  // 刷新列表
                  queryParams.value.pageNum = 1;
                  loadMore();
                } catch (error) {
                  uni.showToast({
                    title: "撤回失败",
                    icon: "error",
                  });
                }
              }
            },
          });
          break;
      }
    },
  });
};

// 编辑
const handleEdit = (notice: NoticePageVO) => {
  uni.navigateTo({
    url: `/pages/work/notice/edit?id=${notice.id}`,
  });
};

// 删除
const handleDelete = (notice: NoticePageVO) => {
  uni.showModal({
    title: "提示",
    content: "确定要删除该通知吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          // await NoticeAPI.delete(notice.id)
          uni.showToast({ title: "删除成功", icon: "success" });
          // 重新加载第一页
          queryParams.value.pageNum = 1;
          loadMore();
        } catch (error) {
          uni.showToast({ title: "删除失败", icon: "none" });
        }
      }
    },
  });
};
// 在 script setup 中添加
const truncateText = (text: string, limit: number = 100): string => {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
};

onReachBottom(() => {
  if (loadState.value === "loading" || loadState.value === "finished") return;
  loadMore();
});

onLoad(() => {
  loadMore();
});
</script>

<style lang="scss" scoped>
.notice-content {
  .label {
    min-width: 160rpx;
    font-size: 24rpx;
    color: var(--wd-text-color-secondary, #999);
  }
  .value {
    flex: 1;
    font-size: 24rpx;
    color: var(--wd-text-color, #333);
  }
  .content-preview {
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--wd-text-color-secondary, #999);
  }
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 卡片标题样式
:deep(.wd-card__title) {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--wd-text-color, #333);
}
</style>
