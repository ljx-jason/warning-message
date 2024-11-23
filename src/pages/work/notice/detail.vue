<template>
  <div class="notice-detail">
    <wd-cell-group>
      <div class="notice-header">
        <h2 class="notice-title">
          <wd-icon name="prompt" size="20px" class="title-icon" />
          {{ noticeDetail.title }}
        </h2>
        <div class="notice-meta">
          <div class="meta-row">
            <span>
              优先级：
              <wd-tag :type="getLevelType(noticeDetail.level)">
                {{ getLevelText(noticeDetail.level) }}
              </wd-tag>
            </span>
          </div>
          <div class="meta-row">
            <span>发布人：{{ noticeDetail.publisherName }}</span>
          </div>
          <div class="meta-row">
            <span>发布时间：{{ noticeDetail.publishTime }}</span>
          </div>
        </div>
      </div>
      <wd-divider />
      <div class="notice-content" v-html="noticeDetail.content" />
    </wd-cell-group>
  </div>
</template>

<script setup lang="ts">
import type { NoticeDetailVO } from "@/api/system/notice";
import NoticeAPI from "@/api/system/notice";

const noticeDetail = ref<NoticeDetailVO>({});

const getLevelText = (level?: string) => {
  const textMap: Record<string, string> = {
    L: "低",
    M: "中",
    H: "高",
  };
  return textMap[level || "L"];
};
const getLevelType = (level?: string): "primary" | "warning" | "danger" => {
  const typeMap: Record<string, "primary" | "warning" | "danger"> = {
    L: "primary",
    M: "warning",
    H: "danger",
  };
  return typeMap[level || "L"];
};

/**
 * 获取通知详情
 * @param id 通知ID
 */
const getNoticeDetail = async (id: string) => {
  try {
    const res = await NoticeAPI.getDetail(id);
    console.log(res);
    noticeDetail.value = res;
  } catch (error) {
    console.error("获取通知详情失败：", error);
  }
};

onLoad((options: any) => {
  if (options && options.id) {
    getNoticeDetail(options.id as string);
  } else {
    uni.showToast({
      title: "通知不存在",
      icon: "none",
    });
  }
});
</script>

<style scoped>
.notice-detail {
  padding: 12px;
  background: #f7f8fa;
}

.notice-header {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.notice-title {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
}

.title-icon {
  color: #666;
}

.notice-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  color: #666;
}

.meta-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
}

.priority-wrapper {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.notice-content {
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  background: #fff;
  border-radius: 8px;
}

:deep(.wd-divider) {
  margin: 0 8px;
}
</style>
