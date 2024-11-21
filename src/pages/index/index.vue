<template>
  <view class="home">
    <wd-swiper
      v-model:current="current"
      :list="swiperList"
      autoplay
      @click="handleClick"
      @change="onChange"
    />

    <!-- 快捷导航 -->
    <wd-grid :column="4" class="mt-2">
      <wd-grid-item v-for="(item, index) in gridList" :key="index" use-slot>
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
        v-for="(item, index) in gridList"
        :key="index"
        use-slot
        custom-class="custom-item"
      >
        <view class="flex justify-start pl-5">
          <view class="flex-center">
            <image class="w-80rpx h-80rpx rounded-8rpx" :src="item.icon" />
            <view class="ml-5 text-left">
              <view class="font-bold">{{ item.title }}</view>
              <view class="mt-1">{{ item.count }}</view>
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
              v-model="dataRange"
              shape="button"
              inline
              @change="handleDataRangeChange"
            >
              <wd-radio :value="1">近7天</wd-radio>
              <wd-radio :value="2">近30天</wd-radio>
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
import LogAPI, { VisitTrendVO, VisitTrendQuery } from "@/api/system/log";

const current = ref<number>(0);

const dataRange = ref<number>(1);

const swiperList = ref([
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/redpanda.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/capybara.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/panda.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/moon.jpg",
  "https://registry.npmmirror.com/wot-design-uni-assets/1.0.4/files/meng.jpg",
]);

const gridList = reactive([
  {
    icon: "/static/icons/user.png",
    title: "在线用户",
    count: 10,
  },
  {
    icon: "/static/icons/role.png",
    title: "浏览量",
    count: 200,
  },
  {
    icon: "/static/icons/dept.png",
    title: "访客数",
    count: 300,
  },
  {
    icon: "/static/icons/dict.png",
    title: "IP数",
    count: 400,
  },
]);

function handleClick(e) {
  console.log(e);
}
function onChange(e) {
  console.log(e);
}

// 图表数据
const chartData = ref({});
const getServerData = () => {
  const { startDate, endDate } = calculateDateRange();

  LogAPI.getVisitTrend({ startDate, endDate }).then((data) => {
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

const handleDataRangeChange = ({ value }: { value: number }) => {
  console.log("handleDataRangeChange", value);
  dataRange.value = value;
  getServerData();
};

const calculateDateRange = () => {
  const now = new Date();

  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const days = dataRange.value === 1 ? 7 : 30;
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  // 手动调整日期为当地时间的 23:59:59
  const adjustDateToLocal = (date: Date) => {
    date.setHours(23, 59, 59, 999);
    return date;
  };

  const adjustedEndDate = adjustDateToLocal(new Date(endDate));
  const adjustedStartDate = adjustDateToLocal(new Date(startDate));
  const formattedStartDate = adjustedStartDate.toISOString().split("T")[0];
  const formattedEndDate = adjustedEndDate.toISOString().split("T")[0];

  return { startDate: formattedStartDate, endDate: formattedEndDate };
};

onReady(() => {
  getServerData();
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
