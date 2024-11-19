<template>
  <view class="log">
    <!-- 筛选 -->
    <wd-drop-menu close-on-click-modal class="mb-20rpx">
      <wd-drop-menu-item ref="dropMenu" title="筛选" icon="filter" icon-size="18px">
        <view>
          <wd-input
            v-model="queryParams.keywords"
            label="关键字"
            type="text"
            placeholder="请输入关键字"
          />
          <wd-calendar
            v-model="timeStampArray"
            label="日期选择"
            type="daterange"
            allow-same-day
            @confirm="handleConfirm"
          />
          <view class="flex flex-row items-center mb-20rpx">
            <wd-button class="mt-20rpx mb-20rpx" size="medium" @click="search()">查询</wd-button>
            <wd-button size="medium" type="info" @click="reset">重置</wd-button>
          </view>
        </view>
      </wd-drop-menu-item>
    </wd-drop-menu>

    <!-- 卡片列表 -->
    <view v-for="(item, index) in pageData" :key="index">
      <wd-card :title="item.operator">
        <wd-row>
          <wd-col v-for="(rowItem, rowIndex) in listPageTypeArray" :key="rowIndex" :span="12">
            <wd-col :span="rowItem.titleSpan">
              <view>{{ rowItem.title }}：</view>
            </wd-col>
            <wd-col :span="rowItem.keySpan">
              <view>{{ item[rowItem.key] }}</view>
            </wd-col>
          </wd-col>
        </wd-row>
        <template #footer>
          <wd-button size="small" plain @click="getDetail(item)">查看详情</wd-button>
        </template>
      </wd-card>
    </view>

    <!-- 查看详情 -->
    <wd-action-sheet v-model="detailShow">
      <view class="p-50rpx">
        <wd-row v-for="(rowItem, rowIndex) in detailTypeArray" :key="rowIndex" class="mt-20rpx">
          <wd-col :span="rowItem.titleSpan">
            <view>{{ rowItem.title }}：</view>
          </wd-col>
          <wd-col :span="rowItem.keySpan">
            <view>{{ logDetail[rowItem.key] }}</view>
          </wd-col>
        </wd-row>
      </view>
    </wd-action-sheet>

    <!-- 加载更多 -->
    <wd-loadmore custom-class="loadmore" :state="loadMoreState" />
  </view>
</template>
<script lang="ts" setup>
import LogAPI, { LogPageVO, LogPageQuery } from "@/api/system/log";
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import { DropMenuItemExpose } from "wot-design-uni/components/wd-drop-menu-item/types";
import { dayjs } from "wot-design-uni";

const loadMoreState = ref<LoadMoreState>("loading");

const queryParams = reactive<LogPageQuery>({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  createTime: ["", ""],
});

const timeStampArray = ref<number[]>([]);

/**
 * 日期格式化
 */
function handleConfirm({ value }: Ref<number[]>) {
  queryParams.createTime[0] = dayjs(value[0]).format("YYYY-MM-DD");
  queryParams.createTime[1] = dayjs(value[1]).format("YYYY-MM-DD");
}
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
  queryParams.createTime = ["", ""];
  timeStampArray.value = [];
  pageData.value = [];
  dropMenu.value?.close();
  handleQuery();
}

// 日志卡片列表数据
const pageData = ref<LogPageVO[]>([]);

onLoad(() => {
  handleQuery();
});

/**
 * 查询
 */
function handleQuery() {
  loadMoreState.value = "loading";
  LogAPI.getPage(queryParams)
    .then((data) => {
      pageData.value?.push(...data.list);
    })
    .catch((e) => {
      console.log("系统异常", e);
    })
    .finally(() => {
      loadMoreState.value = "finished";
    });
}

/**
 * 触底事件
 */
onReachBottom(() => {
  queryParams.pageNum++;
  handleQuery();
});

/**
 * 卡片列表展示字段
 */
interface listPageType {
  title: string;
  key: keyof LogPageVO;
  titleSpan: Number;
  keySpan: Number;
}
const listPageTypeArray = ref<listPageType[]>([
  {
    title: "模块",
    key: "module",
    titleSpan: 8,
    keySpan: 16,
  },
  {
    title: "内容",
    key: "content",
    titleSpan: 8,
    keySpan: 16,
  },
  {
    title: "时间",
    key: "createTime",
    titleSpan: 8,
    keySpan: 16,
  },
  {
    title: "地区",
    key: "region",
    titleSpan: 8,
    keySpan: 16,
  },
]);

/**
 * 卡片内容详情
 */
const logDetail = ref<LogPageVO>({});
const detailShow = ref<boolean>(false);
const detailTypeArray = ref<listPageType[]>([
  {
    title: "模块",
    key: "module",
    titleSpan: 6,
    keySpan: 18,
  },
  {
    title: "内容",
    key: "content",
    titleSpan: 6,
    keySpan: 18,
  },
  {
    title: "时间",
    key: "createTime",
    titleSpan: 6,
    keySpan: 18,
  },
  {
    title: "地区",
    key: "region",
    titleSpan: 6,
    keySpan: 18,
  },
  {
    title: "IP",
    key: "ip",
    titleSpan: 6,
    keySpan: 18,
  },
  {
    title: "浏览器",
    key: "browser",
    titleSpan: 6,
    keySpan: 18,
  },
  {
    title: "终端系统",
    key: "os",
    titleSpan: 6,
    keySpan: 18,
  },
  {
    title: "执行时间(ms)",
    key: "executionTime",
    titleSpan: 8,
    keySpan: 16,
  },
]);

function getDetail(item: LogPageVO) {
  detailShow.value = true;
  logDetail.value = item;
}
</script>

<style lang="scss" scoped>
.log {
  background: #f8f8f8;
}

.wd-col {
  margin-top: 10rpx;
}

::v-deep .wd-drop-menu__item {
  display: flex;
  justify-content: flex-end;
  padding: 0 50rpx;
}
</style>
