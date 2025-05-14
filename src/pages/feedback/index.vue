<template>
  <view class="feedback-container">
    <Header />
    <view class="feedback-page">
      <view class="message">
        <view class="top-basic">
          <view class="top-desc">
            <view class="item">姓名：{{ resultData.idName || "" }}</view>
            <view class="item">证件号：{{ resultData.idNo || "" }}</view>
            <view class="item">性别：{{ resultData.sex || "" }}</view>
            <view class="item">证件类型：{{ resultData.cardType || "" }}</view>
            <view class="item">年龄：{{ resultData.age || "" }}</view>
            <view class="item">证件期限：{{ resultData.cardTerm || "" }}</view>
            <view class="item">职业：{{ resultData.vocation || "" }}</view>
            <view class="item">联系方式：{{ resultData.phone || "" }}</view>
          </view>
          <view>联系地址：{{ resultData.contAddress || "" }}</view>
        </view>
      </view>
      <view class="feedback-list">
        <wd-checkbox-group v-model="checkboxList" size="large" checked-color="#00C192">
          <view v-for="(item, index) in feedbackList" :key="item.ID" class="feedback-item">
            <view class="item-header">
              <text>ID: {{ item.ID }}</text>
              <wd-checkbox v-if="showChecked" :modelValue="item.ID">
              </wd-checkbox>
            </view>
            <view class="item-content">
              <view class="content-row">
                <text class="label">类型：</text>
                <text>{{ item.类型 }}</text>
              </view>
              <view class="content-row">
                <text class="label">证件号：</text>
                <text>{{ item.证件号 }}</text>
              </view>
              <view class="content-row">
                <text class="label">内码：</text>
                <text>{{ item.内码 }}</text>
              </view>
              <view class="content-row">
                <text class="label">辅助信息类型：</text>
                <text>{{ item.辅助信息类型 }}</text>
              </view>
              <view class="content-row">
                <text class="label">问题详情：</text>
                <text :class="{ 'error-text': item.问题详情.includes('不') }">{{ item.问题详情 }}</text>
              </view>
              <view class="content-row">
                <text class="label">归属机构：</text>
                <text>{{ item.归属机构 }}</text>
              </view>
              <view class="content-row">
                <text class="label">归属网点：</text>
                <text>{{ item.归属网点 }}</text>
              </view>
            </view>
            <view class="text-center mt-10px"><wd-button :round="false" type="success"
                @click="submitFeedback(index)">反馈</wd-button>
            </view>
          </view>
        </wd-checkbox-group>
      </view>
      <view class="bottom-bar">
        <wd-button :round="false" size="small" icon="thin-arrow-left" type="info" @click="goBack">返回</wd-button>
        <wd-button style="margin-left: 5px;" :round="false" size="small" icon="read" type="success"
          @click="toggleMultiSelect">多选</wd-button>
        <text class="selected-count">已选: {{ checkboxList.length }}</text>
        <wd-button :round="false" type="success" icon="edit-outline" @click="submitAllFeedback">反馈</wd-button>
      </view>
    </view>
    <wd-popup v-model="showPopup" closable custom-style="width: 80%; height: 50%; paddingTop: 30px;"
      :close-on-click-overlay="false">
      <view class="pop-cont">
        <view class="form-item">
          <label class="form-label">是否整改：</label>
          <wd-radio-group v-model="feedForm.isZg" inline checked-color="#00C192" shape="dot" class="radio-group">
            <wd-radio value="1">是</wd-radio>
            <wd-radio value="0">否</wd-radio>
          </wd-radio-group>
        </view>
        <wd-textarea label="说明：" :maxlength="300" show-word-limit v-model="feedForm.reason" label-width="60px"
          placeholder="请输入..." />
        <view class="footer">
          <wd-button type="info" round @click="showPopup = false">取消</wd-button>
          <wd-button type="primary" round @click="onFeedFormSubmit">提交</wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>
<script setup lang="ts">
import Header from "@/components/header/index.vue";
const showChecked = ref(false);
const showPopup = ref(false);
const checkboxList = ref<string[]>([])
const feedbackList = ref([
  {
    ID: '01',
    类型: '22要素信息',
    证件号: '91330102MA2ABCD123',
    内码: '96541111',
    辅助信息类型: '问题详情',
    问题详情: '证件号不含规',
    归属机构: '九九支行',
    归属网点: '七七网点'
  },
  {
    ID: '02',
    类型: '辅助信息',
    证件号: '91330102MA2ABCD123',
    内码: '98541111',
    辅助信息类型: '企业类型',
    问题详情: '企业类型错误',
    归属机构: '九九支行',
    归属网点: '七七网点'
  }
]);
const resultData = ref({})
onLoad(() => {
  resultData.value = uni.getStorageSync('resultData');
  console.log(resultData);
  uni.removeStorageSync('resultData');
})
const feedForm = ref({
  isZg: "",
  reason: ""
})
const onFeedFormSubmit = () => {

}
const submitFeedback = (index: number) => {
  showPopup.value = true
}
const toggleMultiSelect = () => {
  showChecked.value = !showChecked.value;
  checkboxList.value = [];
}
const submitAllFeedback = () => {
  showPopup.value = true
}
const goBack = () => {
  uni.navigateBack({ delta: 1 })
}
</script>
<style scoped lang="scss">
.feedback-container {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}

.feedback-page {
  width: calc(100vw - 48rpx);
  height: calc(100vh - 200rpx);
  padding: 20rpx;
  overflow-y: auto;
}

.feedback-list {
  margin-bottom: 110rpx;
}

.feedback-item {
  position: relative;
  padding: 30rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16rpx;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.item-content {
  padding: 10rpx 0;
}

.content-row {
  display: flex;
  margin-bottom: 10rpx;
}

.label {
  width: 230rpx;
  color: #666;
}

.error-text {
  color: #ff4d4f;
}

.bottom-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: white;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.selected-count {
  flex: 1;
  text-align: center;
}

.wd-checkbox-group {
  background-color: #F4F6F8;
}

.message {
  // margin: 0 20rpx;
  margin-bottom: 30rpx;

  .top {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 30rpx;
    // line-height: 1.4;
  }

  .icon {
    width: 8rpx;
    height: 48rpx;
    background: linear-gradient(135deg, #3C96CD 0%, #34BA9E 100%);
    border-radius: 2px;
  }

  .title {
    margin-left: 18rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .top-basic {
    padding: 20rpx;
    // margin-top: 20rpx;
    font-size: 28rpx;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 16rpx;
  }

  .top-desc {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    grid-gap: 20rpx;
    margin-bottom: 20rpx;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 30rpx 0;

  .wd-button.is-primary {
    background: linear-gradient(90deg, #3179CD 0%, #17BA7A 100%);
  }
}

:deep(.wd-popup) {
  border-radius: 16rpx !important;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .form-label {
    padding: 0 15px;
    margin-right: 10px;
    font-size: 14px;
    color: #000000D9;
  }

  .radio-group {
    display: flex;
    align-items: center;
  }
}
</style>