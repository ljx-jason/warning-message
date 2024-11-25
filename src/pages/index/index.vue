<template>
  <view class="home">
    <view style="width: 100%; height: var(--status-bar-height)" />
    <wd-swiper
      v-model:current="current"
      :list="swiperList"
      autoplay
      @click="handleClick"
      @change="onChange"
    />

    <!-- 快捷导航 -->
    <wd-grid clickable :column="4" class="mt-2">
      <wd-grid-item
        v-for="(item, index) in navList"
        :key="index"
        use-slot
        link-type="navigateTo"
        :url="item.url"
      >
        <view class="p-2">
          <image class="w-80rpx h-80rpx rounded-8rpx" :src="item.icon" />
        </view>
        <view class="text">{{ item.title }}</view>
      </wd-grid-item>
    </wd-grid>

    <!-- 通知公告 -->
    <wd-notice-bar
      class="mt-2"
      text="这是一条消息提示信息，这是一条消息提示信息，这是一条消息提示信息"
      prefix="check-outline"
      color="#34D19D"
      background-color="#f0f9eb"
    />

    <!-- 数据统计 -->
    <wd-grid :column="2" class="mt-2" :gutter="2">
      <wd-grid-item
        v-for="(item, index) in visitStatsData"
        :key="index"
        use-slot
        custom-class="custom-item"
      >
        <view class="flex justify-start pl-5">
          <view class="flex-center">
            <image class="w-80rpx h-80rpx rounded-8rpx" :src="item.icon" />
            <view class="ml-5 text-left">
              <view class="font-bold">{{ item.title }}</view>
              <view class="mt-1">{{ item.todayCount }}</view>
            </view>
          </view>
        </view>
      </wd-grid-item>
    </wd-grid>

    <wd-card>
      <template #title>
        <view class="flex-between">
          <view>访问趋势</view>
          <view>
            <wd-radio-group
              v-model="recentDaysRange"
              shape="button"
              inline
              @change="handleDataRangeChange"
            >
              <wd-radio :value="7">近7天</wd-radio>
              <wd-radio :value="15">近15天</wd-radio>
            </wd-radio-group>
          </view>
        </view>
      </template>

      <view class="charts-box">
        <qiun-data-charts type="line" :chartData="chartData" />
      </view>
    </wd-card>
  </view>
</template>

<script setup lang="ts">
import { dayjs } from "wot-design-uni";

import LogAPI, { VisitStatsVO } from "@/api/system/log";

interface VisitStats {
  type: string;
  title: string;
  icon: string;
  growthRate: number;
  granularity: string;
  todayCount: number;
}

const current = ref<number>(0);

const visitStatsData = ref<VisitStats[] | null>([
  {
    type: "online",
    title: "在线用户数",
    icon: "/static/icons/online.png",
    growthRate: 0,
    granularity: "-",
    todayCount: 1,
  },
  {
    type: "pv",
    title: "浏览量(PV)",
    icon: "/static/icons/pv.png",
    growthRate: 0,
    granularity: "日",
    todayCount: 0,
  },
  {
    type: "uv",
    title: "访客数(UV)",
    icon: "/static/icons/visit.png",
    growthRate: 0,
    granularity: "日",
    todayCount: 0,
  },
  {
    type: "ip",
    title: "IP数",
    icon: "/static/icons/client.png",
    growthRate: 0,
    granularity: "日",
    todayCount: 0,
  },
]);

// 图表数据
const chartData = ref({});

// 日期范围
const recentDaysRange = ref(7);

const swiperList = ref([
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/redpanda.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/capybara.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/panda.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/moon.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/meng.jpg",
]);

// 快捷导航列表
const navList = reactive([
  {
    icon: "/static/icons/user.png",
    title: "用户管理",
    url: "/pages/work/user/index",
    prem: "sys:user:query",
  },
  {
    icon: "/static/icons/role.png",
    title: "角色管理",
    url: "/pages/work/role/index",
    prem: "sys:role:query",
  },
  {
    icon: "/static/icons/notice.png",
    title: "通知公告",
    url: "/pages/work/notice/index",
    prem: "sys:notice:query",
  },
  {
    icon: "/static/icons/config.png",
    title: "系统配置",
    url: "/pages/work/config/index",
    prem: "sys:config:query",
  },
]);

function handleClick(e: any) {
  console.log(e);
}
function onChange(e: any) {
  console.log(e);
}

// 加载访问统计数据
const loadVisitStatsData = async () => {
  const list: VisitStatsVO[] = await LogAPI.getVisitStats();

  visitStatsData.value?.forEach((item) => {
    const data = list.find((v) => v.type === item.type);
    if (data) {
      item.todayCount = data.todayCount;
      item.growthRate = data.growthRate;
    }
  });
};

// 加载访问趋势数据
const loadVisitTrendData = () => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - recentDaysRange.value);

  const visitTrendQuery = {
    startDate: dayjs(startDate).format("YYYY-MM-DD"),
    endDate: dayjs(endDate).format("YYYY-MM-DD"),
  };

  LogAPI.getVisitTrend(visitTrendQuery).then((data) => {
    const res = {
      categories: data.dates,
      series: [
        {
          name: "浏览量(PV)",
          data: data.pvList,
        },
        {
          name: "IP",
          data: data.ipList,
        },
      ],
    };
    chartData.value = JSON.parse(JSON.stringify(res));
  });
};

//  数据范围变化
const handleDataRangeChange = ({ value }: { value: number }) => {
  console.log("handleDataRangeChange", value);
  recentDaysRange.value = value;
  loadVisitTrendData();
};

onReady(() => {
  loadVisitStatsData();
  loadVisitTrendData();
});
</script>

<style setup lang="scss">
.home {
  padding: 0 10rpx;
  :deep(.custom-item) {
    height: 80px !important;
  }
  :deep(.wd-card) {
    margin: 10rpx 0 !important;
  }
}

.charts-box {
  width: 100%;
  height: 300px;
}
</style>
