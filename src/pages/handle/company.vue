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
              <wd-input label="注册资金" v-model="handleForm.dayPayLimit" label-width="8.2em" placeholder="请输入" />
              <wd-picker label="注册行业" prop="dayTradeFreq" :columns="columns" v-model="handleForm.dayTradeFreq"
                label-width="8.2em" @open="selectPicker('dayTradeFreq')" />
              <wd-form-item prop="amountRange" label="资金范围">
                <wd-row>
                  <wd-col span="11">
                    <wd-input v-model="handleForm.minAmount" type="digit" placeholder="最低金额" clearable><template
                        #suffix>
                        <view style="padding-left: 8px;">元</view>
                      </template></wd-input>
                  </wd-col>
                  <wd-col span="2" style="text-align: center;">至</wd-col>
                  <wd-col span="11">
                    <wd-input v-model="handleForm.maxAmount" type="digit" placeholder="最高金额" clearable>
                      <template #suffix>
                        <view style="padding-left: 8px;">元</view>
                      </template></wd-input>
                  </wd-col>
                </wd-row>
              </wd-form-item>
              <wd-input label="法人代表/负责人姓名" v-model="handleForm.dayPayLimit" label-width="8.2em" placeholder="请输入" />
              <wd-calendar label="成立日期" :show-confirm="false" v-model="handleForm.dayPayLimit" />
              <wd-picker label="主要产品" prop="dayTradeFreq" :columns="columns" v-model="handleForm.dayTradeFreq"
                label-width="8.2em" @open="selectPicker('dayTradeFreq')" />
              <wd-calendar label="注册登记日期" :show-confirm="false" v-model="handleForm.dayPayLimit" />
              <wd-picker label="风险企业类别" prop="yearRevScale" :columns="columns" v-model="handleForm.yearRevScale"
                label-width="8.2em" @open="selectPicker('yearRevScale')" />
              <wd-calendar label="营业期限" type="daterange" :show-confirm="false" v-model="handleForm.dayPayLimit" />
              <wd-input label="营业收入" v-model="handleForm.minAmount" type="digit" placeholder="请输入" clearable><template
                  #suffix>
                  <view style="padding-left: 8px;">元</view>
                </template></wd-input>
              <wd-picker :columns="columns" label="注册登记币种" v-model="handleForm.telFraudPunishSit" label-width="8.2em"
                @open="selectPicker('telFraudPunishSit')" />
              <wd-input label="资产总额" v-model="handleForm.minAmount" type="digit" placeholder="请输入" clearable><template
                  #suffix>
                  <view style="padding-left: 8px;">元</view>
                </template></wd-input>
              <wd-picker :columns="columns" label="注册区域类型" v-model="handleForm.isOtherOpenAccount" label-width="8.2em"
                @open="selectPicker('isOtherOpenAccount')" />
              <wd-input label="从业人员" v-model="handleForm.dayPayLimit" label-width="8.2em" placeholder="请输入" />
              <wd-picker :columns="columns" label="客户类型" v-model="handleForm.otherRelation" label-width="8.2em"
                @open="selectPicker('otherRelation')" />
              <wd-picker :columns="columns" label="经营场地所有权" v-model="handleForm.otherRelation" label-width="8.2em"
                @open="selectPicker('otherRelation')" />
              <wd-picker :columns="columns" label="企业规模" v-model="handleForm.otherRelation" label-width="8.2em"
                @open="selectPicker('otherRelation')" />
              <wd-input label="经营场地面积" v-model="handleForm.minAmount" type="digit" placeholder="请输入" clearable><template
                  #suffix>
                  <view style="padding-left: 8px;">km²</view>
                </template></wd-input>
              <wd-picker :columns="columns" label="企业控股类型" v-model="handleForm.otherRelation" label-width="8.2em"
                @open="selectPicker('otherRelation')" />
              <wd-picker :columns="columns" label="客户支持类型" v-model="handleForm.payLimitLevel" label-width="8.2em"
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
  payLimitLevel: '',
  minAmount: '',
  maxAmount: '',
  amountRange: ''
})
const rules = {
  fundSource: [{ required: true, message: '请选择资金来源', trigger: 'change' }],
  tradeMode: [{ required: true, message: '请选择交易模式', trigger: 'change' }],
  dayTradeFreq: [{ required: true, message: '请选择日交易频次', trigger: 'change' }],
  yearRevScale: [{ required: true, message: '请选择年收入规模', trigger: 'change' }],
  amountRange: [
    { validator: validateRange, trigger: 'change' }
  ]
}
const validateRange = (rule, value, callback) => {
  const { minAmount, maxAmount } = handleForm
  if (minAmount && maxAmount) {
    if (parseFloat(minAmount) > parseFloat(maxAmount)) {
      callback(new Error('最低金额不能大于最高金额'))
    } else {
      callback()
    }
  } else {
    callback()
  }
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
