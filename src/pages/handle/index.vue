<template>
  <view class="handle-container">
    <view class="container">
      <Header />
      <view class="home">
        <view class="msg">
          <view class="title">
            <img src="/static/images/user.png" alt="" />
            <text>人工核实</text>
          </view>
          <wd-form ref="handleFormRef" :model="handleForm" :rules="rules">
            <wd-cell-group>
              <wd-cell prop="fundSource" title="资金来源(可多选)" title-width="120px">
                <view class="text-left">
                  <wd-checkbox-group v-model="handleForm.fundSource" inline checked-color="#00C192">
                    <wd-checkbox v-for="(item, index) in fundSourceData" :modelValue="item.value" shape="square">{{
                      item.text }}</wd-checkbox>
                  </wd-checkbox-group>
                </view>
              </wd-cell>
              <wd-input v-if="showFound" v-model="handleForm.sourceOtherDesc" label="资金来源其他描述" label-width="8.2em"
                placeholder="请输入" />
              <wd-cell prop="tradeMode" title="交易模式(可多选)" title-width="120px">
                <view class="text-left">
                  <wd-checkbox-group v-model="handleForm.tradeMode" inline checked-color="#00C192">
                    <wd-checkbox v-for="(item, index) in tradeModeData" :modelValue="item.value" shape="square">{{
                      item.text }}</wd-checkbox>
                  </wd-checkbox-group>
                </view>
              </wd-cell>
              <wd-input v-if="showTrade" v-model="handleForm.modeOtherDesc" label="交易模式其他描述" label-width="8.2em"
                placeholder="请输入" />
              <wd-picker prop="dayTradeFreq" :columns="columns" label="日交易频次" v-model="handleForm.dayTradeFreq"
                label-width="8.2em" @open="selectPicker('dayTradeFreq')" />
              <wd-picker prop="yearRevScale" :columns="columns" label="年收入规模" v-model="handleForm.yearRevScale"
                label-width="8.2em" @open="selectPicker('yearRevScale')" />
              <wd-input label="日非柜面支付额度" v-model="handleForm.dayPayLimit" label-width="8.2em" placeholder="请输入" />
              <wd-input label="月非柜面支付额度" v-model="handleForm.monthPayLimit" label-width="8.2em" placeholder="请输入" />
              <wd-input label="年非柜面支付额度" v-model="handleForm.yearPayLimit" label-width="8.2em" placeholder="请输入" />
              <wd-picker :columns="columns" label="电信诈骗及惩戒宣传情况" v-model="handleForm.telFraudPunishSit"
                label-width="8.2em" @open="selectPicker('telFraudPunishSit')" />
              <wd-picker :columns="columns" label="是否代理开户" v-model="handleForm.isOtherOpenAccount" label-width="8.2em"
                @open="selectPicker('isOtherOpenAccount')" />
              <wd-picker :columns="columns" label="代理人和被代理人关系" v-model="handleForm.otherRelation" label-width="8.2em"
                @open="selectPicker('otherRelation')" />
              <wd-input v-if="handleForm.otherRelation == '其他'" v-model="handleForm.otherRelationDesc"
                label="代理人和被代理人关系描述" label-width="8.2em" placeholder="请输入" />
              <wd-picker :columns="columns" label="支付限额等级" v-model="handleForm.payLimitLevel" label-width="8.2em"
                placeholder="请选择" @open="selectPicker('payLimitLevel')" />
            </wd-cell-group>
          </wd-form>
        </view>
        <view class="footer">
          <wd-button icon="thin-arrow-left" type="info" @click="goBack">返回</wd-button>
          <wd-button icon="check" type="primary" @click="onSubmit">保存</wd-button>
        </view>
        <!-- <wd-popup v-model="showPicker" position="bottom">
          <wd-picker show-toolbar :columns="columns" @confirm="onConfirmPicker" @cancel="showPicker = false" />
        </wd-popup> -->
      </view>
    </view>
  </view>
</template>

<script setup>
import MainApi from "@/api/main"
import Header from "@/components/header/index.vue"
import {
  fundSourceData,
  tradeModeData,
  dayTradeFreqData,
  yearRevScaleData,
  dayPayLimitData,
  monthPayLimitData,
  yearPayLimitData,
  telFraudPunishSitData,
  isOtherOpenAccountData,
  otherRelationData,
  payLimitLevelData
} from "@/data/index"
const uuid = ref('')
onLoad((options) => {
  uuid.value = options.uuid
})
const handleForm = reactive({
  fundSource: [],
  sourceOtherDesc: '',
  tradeMode: [],
  modeOtherDesc: '',
  dayTradeFreq: '',
  yearRevScale: '',
  dayPayLimit: '',
  monthPayLimit: '',
  yearPayLimit: '',
  telFraudPunishSit: '',
  otherRelation: '',
  isOtherOpenAccount: '',
  otherRelationDesc: '',
  payLimitLevel: ''
})
const rules = {
  fundSource: [{ required: true, message: '请选择资金来源', trigger: 'change' }],
  tradeMode: [{ required: true, message: '请选择交易模式', trigger: 'change' }],
  dayTradeFreq: [{ required: true, message: '请选择日交易频次', trigger: 'change' }],
  yearRevScale: [{ required: true, message: '请选择年收入规模', trigger: 'change' }],
}
const handleFormRef = ref()

const columns = ref([])
const selectParams = ref('')
const selectPicker = (query) => {
  if (query === "fundSource") {
    columns.value = fundSourceData;
  } else if (query === "tradeMode") {
    columns.value = tradeModeData;
  } else if (query === "dayTradeFreq") {
    columns.value = dayTradeFreqData;
  } else if (query === "yearRevScale") {
    columns.value = yearRevScaleData;
  } else if (query === "dayPayLimit") {
    columns.value = dayPayLimitData;
  } else if (query === "monthPayLimit") {
    columns.value = monthPayLimitData;
  } else if (query === "yearPayLimit") {
    columns.value = yearPayLimitData;
  } else if (query === "telFraudPunishSit") {
    columns.value = telFraudPunishSitData;
  } else if (query === "isOtherOpenAccount") {
    columns.value = isOtherOpenAccountData;
  } else if (query === "otherRelation") {
    columns.value = otherRelationData;
  } else if (query === "payLimitLevel") {
    columns.value = payLimitLevelData;
  }
  selectParams.value = query;
}
const showFound = ref(false);
const showTrade = ref(false);
watch([() => handleForm.fundSource, () => handleForm.tradeMode], ([newFound, newTrade]) => {
  if (newFound.includes(5)) {
    showFound.value = true
  } else {
    showFound.value = false
  }
  if (newTrade.includes(7)) {
    showTrade.value = true
  } else {
    showTrade.value = false
  }
}, { immediate: true })
const goBack = () => {
  uni.navigateBack({ delta: 1 })
}

const onSubmit = () => {
  const params = {
    uuid: uuid.value,
    ...handleForm,
    fundSource: handleForm.fundSource.toString(),
    tradeMode: handleForm.tradeMode.toString(),
  };
  console.log("params", params);
  handleFormRef.value.validate().then(({ valid }) => {
    if (valid) {
      MainApi.saveManualVerifyInfo(params).then(res => {
        if (res.status == 0) {
          uni.showToast({
            title: "保存成功",
            icon: "none"
          })
          uni.navigateBack()
        } else {
          uni.showToast({
            title: res.msg,
            icon: "error"
          })
        }
      })
    } else {
      uni.showToast({
        title: "请填写完整",
        icon: "error"
      })
    }
  })
}

</script>

<style scoped lang="scss">
.handle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;

  // background: #F4F6F8;
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .home {
    flex: 1;
    padding: 0 20rpx;
    // margin: 24rpx;
    overflow-y: auto;
    background: #fff;
    // border-radius: 20px;

    .msg {
      width: 100%;
    }

    .title {
      display: flex;
      justify-content: center;
      margin: 34rpx 0;

      img {
        position: relative;
        top: 4px;
        width: 24rpx;
        height: 32rpx;
      }

      text {
        margin-left: 5px;
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
      }
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
}
</style>
