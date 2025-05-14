<template>
  <view class="home-container">
    <view class="container">
      <Header />
      <view class="home">
        <view class="message">
          <view class="top">
            <view class="icon"></view>
            <view class="title">客户信息</view>
            <view class="nav" @click="changeMsg">
              {{ isChecked ? "基础信息" : "营销信息" }}
            </view>
          </view>
          <view class="top-basic">
            <view>名称：{{ nineData.idName || "" }}</view>
            <view>经营范围：{{ resultData.idNo || "" }}</view>
            <view>地址：{{ resultData.contAddress || "" }}</view>
            <view>证件号：{{ resultData.contAddress || "" }}</view>
          </view>
        </view>
        <view class="message">
          <view class="top">
            <view class="icon"></view>
            <view class="title">异常字段</view>
          </view>
          <view class="bottom">
            <view class="tag-box">
              <text class="tag-box-item">标签</text>
              <text class="tag-box-item">标签</text>
              <text class="tag-box-item">标签</text>
            </view>
          </view>
          <view class="text-center">
            <wd-button type="success" size="small" :round="false" @click="toFeedBack">反馈</wd-button>
          </view>
        </view>
        <view v-if="isChecked">
          <view class="message">
            <view class="top">
              <view class="icon"></view>
              <view class="title">产品营销</view>
            </view>
            <view class="bottom">
              <wd-table :data="cp_arr" :height="300">
                <wd-table-col prop="mktName" label="产品名称"></wd-table-col>
                <wd-table-col prop="isDeal" label="是否办理"></wd-table-col>
              </wd-table>
            </view>
          </view>
          <view class="message">
            <view class="top">
              <view class="icon"></view>
              <view class="title">指标营销</view>
            </view>
            <view class="bottom">
              <wd-table :data="zb_arr" :height="300">
                <wd-table-col prop="mktName" label="指标名称"></wd-table-col>
                <wd-table-col prop="isDeal" label="是否满足"></wd-table-col>
                <wd-table-col prop="currBal" label="当前余额"></wd-table-col>
                <wd-table-col prop="dayAvgBal" label="日均余额"></wd-table-col>
              </wd-table>
            </view>
          </view>
        </view>
        <view v-else>
          <view class="message">
            <view class="top">
              <view class="icon"></view>
              <view class="title mr-10px">账户&内码信息</view>
              <wd-button type="success" :round="false" size="small" @click="handldeDetail">详情</wd-button>
            </view>
            <view class="bottom">
              <view>
                {{ resultData?.accountCodeListData?.accountCodeList || "" }}
              </view>
              <view class="account-row-info">
                <view>
                  不动户数：{{
                    resultData?.accountControlInfoData?.houseHoldNum || ""
                  }}
                </view>
                <view>
                  管控账户数：{{
                    resultData?.accountControlInfoData?.accountExceCount || ""
                  }}
                </view>
                <view>
                  信用卡户数：{{
                    resultData?.accountCodeListData?.crCardAmt || ""
                  }}
                </view>
                <view>
                  社保卡挂失次数：{{
                    resultData?.accountCodeListData?.sinLostTms || ""
                  }}
                </view>
              </view>
              <view class="tag-box mt-10px">
                <text>手机号重复：{{
                  resultData?.accountCodeListData?.isRepeatPhone == '1' ? '是' : '否' || ""
                }}</text>
                <text>一证多码：{{
                  resultData?.accountCodeListData?.isYzDm == '1' ? '是' : '否' || ""
                }}</text>
                <text>一码多证：{{
                  resultData?.accountCodeListData?.isYmDz == '1' ? '是' : '否' || ""
                }}</text>
                <text>假名匿名：{{
                  resultData?.accountCodeListData?.isFalseHideName == '1' ? '是' : '否' || ""
                }}</text>
                <text>可疑账户共享条数：{{
                  resultData?.accountCodeListData?.bankListTp
                }}</text>
              </view>
            </view>
          </view>
          <view class="footer">
            <wd-button icon="thin-arrow-left" type="info" @click="goBack">返回主页</wd-button>
            <!-- <wd-button icon="edit-outline" type="success" @click="submit">核实</wd-button> -->
          </view>
        </view>
      </view>
      <wd-popup v-model="show" closable :close-on-click-overlay="false"
        custom-style="width: 90%; height: 90%; paddingTop: 30px;">
        <view class="p-10px">
          <wd-table :data="detailList" :height="300">
            <wd-table-col prop="idNo" label="身份证号"></wd-table-col>
            <wd-table-col prop="accountNo" label="账号"></wd-table-col>
            <wd-table-col prop="cardNum" label="卡号"></wd-table-col>
            <wd-table-col prop="dayLimit" label="非柜面限额(日)"></wd-table-col>
            <wd-table-col prop="controlStatus" label="管控状态"></wd-table-col>
            <wd-table-col prop="controlReason" label="管控/限额原因" width="200rpx"></wd-table-col>
            <wd-table-col prop="controlTime" label="管控时间"></wd-table-col>
            <wd-table-col prop="operator" label="操作人"></wd-table-col>
            <wd-table-col prop="isNonActv" label="是否不动户"></wd-table-col>
            <wd-table-col prop="nonDayMaxTurnover" label="非柜借方单日最大累计交易额"></wd-table-col>
            <wd-table-col prop="provBankSugstLmt" label="省行建议限额(日)"></wd-table-col>
          </wd-table>
          <view class="tit">手机是否重复：{{ isPhoneSame }}</view>
          <wd-table :data="ratainPhoneVerifys" :height="300">
            <wd-table-col prop="retainPhone" label="手机号码"></wd-table-col>
            <wd-table-col prop="idNo" label="证件号"></wd-table-col>
            <wd-table-col prop="custName" label="客户名称"></wd-table-col>
          </wd-table>
          <view class="tit">假名匿名列表</view>
          <wd-table :data="assFalseHideNames" :height="300">
            <wd-table-col prop="codeName" label="内码名称"></wd-table-col>
            <wd-table-col prop="certName" label="证件名称"></wd-table-col>
            <wd-table-col prop="acctName" label="账户名称"></wd-table-col>
            <wd-table-col prop="acctNo" label="对应账户"></wd-table-col>
          </wd-table>
          <view class="tit">一证多码：{{ isYzdm }}</view>
          <wd-table :data="yzdmList" :height="300">
            <wd-table-col prop="idNoStr" label="证件号"></wd-table-col>
            <wd-table-col prop="csnoStr" label="内码"></wd-table-col>
            <wd-table-col prop="acctName" label="账户名称"></wd-table-col>
            <wd-table-col prop="acctNo" label="对应账户"></wd-table-col>
          </wd-table>
          <view class="tit">一码多证：{{ isYmdz }}</view>
          <wd-table :data="ymdzList" :height="300">
            <wd-table-col prop="idNoStr" label="内码"></wd-table-col>
            <wd-table-col prop="csnoStr" label="证件号"></wd-table-col>
          </wd-table>
          <view class="tit">
            <text class="mr-10px">可疑账户共享</text><wd-button type="success" size="small" :round="false"
              @click="handleAdd">新增</wd-button>
          </view>
          <wd-table :data="doubtListShare" :height="300">
            <wd-table-col prop="createTime" label="导入时间"></wd-table-col>
            <wd-table-col prop="cardName" label="客户姓名"></wd-table-col>
            <wd-table-col prop="cardId" label="证件号"></wd-table-col>
            <wd-table-col prop="accountNo" label="账号"></wd-table-col>
            <wd-table-col prop="reason" label="原因"></wd-table-col>
          </wd-table>
        </view>
      </wd-popup>
      <wd-popup v-model="showAdd" closable custom-style="width: 80%; height: 50%; paddingTop: 30px;"
        :close-on-click-overlay="false">
        <view class="pop-cont">
          <wd-input label="客户姓名" v-model="resultData.cardName" label-width="60px" readonly />
          <wd-input label="证件号" v-model="resultData.cardId" label-width="60px" readonly />
          <wd-input label="账号" v-model="addForm.accountNo" label-width="60px" placeholder="请输入" />
          <wd-input label="原因" v-model="addForm.reason" label-width="60px" placeholder="请输入" />
          <view class="footer">
            <wd-button type="primary" round @click="onAddSubmit">保存</wd-button>
          </view>
        </view>
      </wd-popup>
      <!-- <wd-popup v-model="showManual" closable custom-style="width: 100%; height: 100%;" :close-on-click-overlay="false">
        <Manual :uuid="resultData.uuid" @closePopup="closePopup" />
      </wd-popup> -->
    </view>
  </view>
</template>

<script setup>
import Header from "@/components/header/index.vue";
// import Manual from "../handle/index.vue";
import MainAPI from "@/api/main";
const props = defineProps({ data: { type: String, default: '' } })
const isChecked = ref(false)
const changeMsg = () => isChecked.value = !isChecked.value
watch(isChecked, (newVal) => {
  if (newVal) {
    getMktInfoLists()
  }
})
const toFeedBack = () => {
  let obj = { idName: nineData.value.idName, idNo: resultData.idNo, sex: resultData.sex, cardType: resultData.cardType, age: resultData.age, cardTerm: resultData.cardTerm, vocation: resultData.vocation, phone: resultData.phone, contAddress: resultData.contAddress };
  uni.setStorageSync('resultData', obj);
  uni.navigateTo({ url: '/pages/feedback/index' })
}
// 营销信息展示
const getMktInfoLists = () => {
  MainAPI.getMktInfoList({
    cardId: resultData.cardId
  }).then(res => {
    if (res.marketingInfoList?.length) {
      cp_arr.value = res.marketingInfoList.filter(
        (item) => item.mktType == "1"
      );
      zb_arr.value = res.marketingInfoList.filter(
        (item) => item.mktType == "2"
      );
    }
  })
}
onMounted(() => {
  init()
})
const init = () => {
  uni.showLoading({
    title: '加载中...',
    mask: true,
  });
  MainAPI.getOneKeyInterface({
    ...JSON.parse(decodeURIComponent(props.data)),
    queryOrigin: 3
  }).then(res => {
    uni.hideLoading();
    if (res.status == 0) {
      Object.assign(resultData, res.data || {})
      nineData.value = res.data.idInfoListData?.basicInfo
        ? JSON.parse(res.data.idInfoListData?.basicInfo)
        : {};
    } else {
      uni.showToast({ title: res.msg, icon: 'none' });
      resultData.mobileVerifyData = {
        isSelf: "0",
        reCardId: "",
        reCardName: "",
        relation: "",
        mobileVerifyResult: "0000"
      };
    }
  })
}
const show = ref(false);
const detailList = ref([])
const ratainPhoneVerifys = ref([])
const yzdmList = ref([])
const ymdzList = ref([])
const assFalseHideNames = ref([])
const doubtListShare = ref([])
const isYmdz = ref('')
const isYzdm = ref('')
const isPhoneSame = ref('')
const handldeDetail = () => {
  MainAPI.getAccountControlDetail({
    cardId: resultData.cardId,
    phone: resultData.phone
  }).then(res => {
    if (res.code == 1) {
      show.value = true
      detailList.value = res.accountControlInfos
      ratainPhoneVerifys.value = res.ratainPhoneVerifys
      yzdmList.value = res.yzdmList
      ymdzList.value = res.ymdzList
      assFalseHideNames.value = res.assFalseHideNames
      doubtListShare.value = res.doubtListShare
      isYmdz.value = res.isYmdz
      isYzdm.value = res.isYzdm
      isPhoneSame.value = res.isPhoneSame
    } else {
      show.value = false
      uni.showToast({
        title: res.result,
        icon: "none"
      })
    }
  })
}
// 可疑账户共享
const addForm = ref({
  accountNo: '',
  reason: ''
})
const showAdd = ref(false)
const handleAdd = () => {
  showAdd.value = true
}
const onAddSubmit = () => {
  if (addForm.value.reason) {
    MainAPI.saveDoubtListShare({
      ...addForm.value,
      cardName: resultData.cardName,
      cardId: resultData.cardId,
      gyh: resultData.gyh,
    }).then(res => {
      if (res.status === 0) {
        getDoubtListShares()
        showAdd.value = false
      }
      uni.showToast({
        title: res.msg,
        icon: "none"
      })
    })
  } else {
    uni.showToast({
      title: '请输入原因',
      icon: 'none'
    })
  }
}
const getDoubtListShares = () => {
  MainAPI.getDoubtListShare({
    cardId: resultData.cardId,
  }).then(res => {
    if (res.status === 1) {
      doubtListShare.value = res.data
    }
  })
}

const nineData = ref({})
const cp_arr = ref([])
const zb_arr = ref([])
const resultData = reactive({})

// 取现异常说明
const qx = ref({
  qxSfyc: "",
  qxJe: "",
  qxYcsm: ""
})
const onSubmitQxYcsm = () => {
  if (!qx.value.qxJe) {
    uni.showToast({
      title: "请输入取现金额",
      icon: "none"
    })
    return
  }
  if (qx.value.qxSfyc === '1') {
    if (!qx.value.qxYcsm) {
      uni.showToast({
        title: "请输入异常说明",
        icon: "none"
      })
      return
    }
  }
  MainAPI.riskVerifyQxFeedback({
    gyh: resultData.gyh,
    cardId: resultData.cardId,
    phone: resultData.phone,
    verifyType: "48",
    qxSfyc: qx.value.qxSfyc,
    qxJe: qx.value.qxJe,
    qxYcsm: qx.value.qxYcsm,
  }).then(res => {
    if (res.riskVerifyResult === "查询成功") {
      uni.showToast({
        title: "提交成功",
        icon: "none"
      })
    } else {
      uni.showToast({
        title: res.msg,
        icon: "error"
      })
    }
  }
  )
}
// 手机三要素不匹配说明
const unMatched = ref("")
const unMatchedDesc = () => {
  MainAPI.saveUnMatchedDesc({
    uuid: resultData.uuid,
    unMatched: unMatched.value
  }).then(res => {
    if (res.status == 0) {
      uni.showToast({
        title: "保存成功",
        icon: "none"
      })
    } else {
      uni.showToast({
        title: res.msg,
        icon: "error"
      })
    }
  })
}

// 云互联备注
const interCloudRecord = ref("")
const cloudDesc = () => {
  MainAPI.getSaveInterCloudDesc({
    uuid: resultData.uuid,
    interCloudRecord: interCloudRecord.value
  }).then(res => {
    if (res.status == 0) {
      uni.showToast({
        title: "保存成功",
        icon: "none"
      })
    } else {
      uni.showToast({
        title: res.msg,
        icon: "error"
      })
    }
  })
}

// 云互联办理结果
const status = ref("")
const columnStatus = ref([
  "成功开户",
  "拒绝开户",
  "客户终止",
  "非新开户查询"
])
const handleConfirmStatus = ({ value }) => {
  status.value = value
}
const feedResult = () => {
  MainAPI.interCloudFeedBack({
    uuid: resultData.uuid,
    status: status.value,
    gyh: resultData.gyh
  }).then(res => {
    if (res.status == 0) {
      uni.showToast({
        title: "保存成功",
        icon: "none"
      })
    } else {
      uni.showToast({
        title: res.msg,
        icon: "error"
      })
    }
  })
}

const showManual = ref(false)
const submit = () => {
  // showManual.value = true
  uni.navigateTo({ url: '/pages/handle/company?uuid=' + resultData.uuid })
}
const closePopup = () => {
  showManual.value = false
}
const goBack = () => {
  uni.navigateBack({ delta: 1 })
}
</script>

<style scoped lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  background: #F4F6F8;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.home {
  flex: 1;
  padding: 0 20rpx;
  margin: 24rpx;
  overflow-y: auto;
  background: #fff;
  border-radius: 20px;

  .message {
    margin: 0 20rpx;

    .top {
      position: relative;
      display: flex;
      margin-top: 30rpx;
      line-height: 1.4;
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
      margin-top: 20rpx;
      font-size: 28rpx;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      border-radius: 6px;
    }

    .top-desc {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      grid-gap: 20rpx;
      margin-bottom: 20rpx;
    }

    .bottom {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #333333;

      .item {
        margin-right: 20rpx;

        .result {
          color: #FF8900;
        }
      }
    }

    .nav {
      position: absolute;
      top: 4rpx;
      right: 20rpx;
      font-size: 28rpx;
      color: #3C96CD;
    }

    .lastDesc {
      display: flex;
      align-items: center;
      font-size: 28rpx;
    }

    .clound {
      margin-bottom: 20rpx;
      background: rgba(0, 193, 146, 0.1);
      border-radius: 4px;

      .item {
        width: 100%;
        padding: 18rpx;

        img {
          width: 70rpx;
        }
      }
    }

    .tag-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 18rpx;

      text {
        padding: 10rpx;
        font-size: 24rpx;
        color: #333;
        text-align: center;
        border: 1px solid #00C192;
        border-radius: 8px;
      }

      &-item {
        padding: 20rpx;
        color: #ee0a24 !important;
        border: 1px solid #c12d00 !important;
      }

      .cur {
        color: #ee0a24;
      }
    }

    // .tag-box-item {
    //   color: #fff !important;
    //   background-color: #FA4350;
    //   border: 1px solid #FA4350 !important;
    // }

    :deep(.wd-card) {
      margin-top: 10px;
      background-color: #f5f5f5;
      border-radius: 6px;
    }

    .account-row-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
      margin-top: 10px;
      font-size: 24rpx;
      color: #ee0a24;
    }
  }

  :deep(.wd-checkbox__txt) {
    overflow: visible;
  }
}

.tit {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 28rpx;
  font-weight: 600;
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
</style>
