<template>
  <view>
    <!-- 添加搜索栏 -->
    <wd-drop-menu close-on-click-modal class="mb-20rpx mr-20rpx ml-20rpx">
      <wd-drop-menu-item ref="dropMenu" title="筛选" icon="filter" icon-size="18px">
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
    <view v-for="(item, index) in dataList" :key="index" class="mt-20rpx">
      <wd-card>
        <template #title>
          <view class="flex items-center justify-between">
            <view class="flex-1 text-truncate">{{ item.title }}</view>
            <wd-tag :type="getStatusType(item.publishStatus)" size="small">
              {{ getStatusText(item.publishStatus) }}
            </wd-tag>
          </view>
        </template>
        <wd-row class="mb-20rpx">
          <wd-col :span="12">
            <wd-col :span="12">
              <view>通告目标类型：</view>
            </wd-col>
            <wd-col :span="12">
              <view>{{ item.targetType === 1 ? "指定" : "全体" }}</view>
            </wd-col>
          </wd-col>
          <wd-col v-if="item.publishStatus === 1" :span="12">
            <wd-col :span="8">
              <view>发布时间：</view>
            </wd-col>
            <wd-col :span="16">
              <view>{{ formatDate(item.publishTime) }}</view>
            </wd-col>
          </wd-col>
          <wd-col v-else :span="12">
            <wd-col :span="8">
              <view>撤回时间：</view>
            </wd-col>
            <wd-col :span="16">
              <view>{{ formatDate(item.revokeTime) }}</view>
            </wd-col>
          </wd-col>
        </wd-row>
        <wd-row class="mb-20rpx">
          <wd-col :span="12">
            <wd-col :span="8">
              <view>发布人：</view>
            </wd-col>
            <wd-col :span="16">
              <view>{{ item.publisherName || "-" }}</view>
            </wd-col>
          </wd-col>
          <wd-col :span="12">
            <wd-col :span="8">
              <view>紧急程度：</view>
            </wd-col>
            <wd-col :span="16">
              <view>{{ getLevelType(item.level) || "-" }}</view>
            </wd-col>
          </wd-col>
        </wd-row>

        <template #footer>
          <view class="flex justify-end gap-20rpx">
            <wd-button size="small" plain @click="handleView(item)">查看详情</wd-button>
            <wd-button size="small" type="primary" @click="handleAction(item)">更多操作</wd-button>
          </view>
        </template>
      </wd-card>
    </view>

    <!-- 加载更多 -->
    <wd-loadmore custom-class="loadmore" :state="loadState" />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import { DropMenuItemExpose } from "wot-design-uni/components/wd-drop-menu-item/types";
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
});

// 添加搜索处理函数
const dropMenu = ref<DropMenuItemExpose>();
const handleSearch = () => {
  queryParams.value.pageNum = 1;
  loadMore();
  dropMenu.value?.close();
};

// 重置
const reset = () => {
  queryParams.value = { pageNum: 1, pageSize: 10 };
  dropMenu.value?.close();
  loadMore();
};

// 获取状态样式
const getStatusType = (
  status: number | undefined
): "default" | "primary" | "danger" | "warning" | "success" => {
  if (!status) return "default";
  const statusMap: Record<number, "default" | "primary" | "danger" | "warning" | "success"> = {
    0: "primary",
    1: "success",
    [-1]: "warning",
  };
  return statusMap[status] || "default";
};

// 获取状态文本
const getStatusText = (status: number | undefined): string => {
  if (status !== 0 && !status) return "-";
  const statusMap: Record<number, string> = {
    0: "未发布",
    1: "已发布",
    [-1]: "已撤回",
  };
  return statusMap[status] || "未知";
};

// 格式化日期
const formatDate = (date: Date | undefined): string => {
  return date ? date.toString() : "-";
};

const getLevelType = (level: string | number | undefined): string => {
  if (!level) return "-";
  const levelMap: Record<string, string> = {
    L: "低",
    M: "中",
    H: "高",
  };
  return levelMap[level] || "未知";
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
  const actions = notice.publishStatus !== 1 ? ["删除", "发布"] : ["撤回"];
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
          handlePublish(notice);
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
          await NoticeAPI.deleteByIds(notice.id);
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

// 发布
const handlePublish = (notice: NoticePageVO) => {
  uni.showModal({
    title: "提示",
    content: "确定要发布该通知吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await NoticeAPI.publish(Number(notice.id));
          uni.showToast({ title: "发布成功", icon: "success" });
          // 重新加载第一页
          queryParams.value.pageNum = 1;
          loadMore();
        } catch (error) {
          uni.showToast({ title: "发布失败", icon: "none" });
        }
      }
    },
  });
};

onReachBottom(() => {
  if (loadState.value === "loading" || loadState.value === "finished") return;
  loadMore();
});

onLoad(() => {
  loadMore();
});
</script>
