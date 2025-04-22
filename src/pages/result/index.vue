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
            <view class="top-desc">
              <view class="item">姓名：{{ nineData.idName || "" }}</view>
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
              <view class="title">手机号码三要素</view>
              <wd-tag class="ml-10rpx" plain :type="resultData?.mobileVerifyData?.mobileVerifyResult.slice(
                0,
                4
              ) == '查询成功'
                ? 'success'
                : 'danger'
                " size="small">{{
                  resultData?.mobileVerifyData?.mobileVerifyResult.slice(0, 4)
                }}</wd-tag>
            </view>
            <view class="bottom">
              <view class="item">
                验证结果:
                <wd-text :type="resultData?.mobileVerifyData?.threeCheckResult == '全匹配'
                  ? 'success'
                  : 'error'
                  " :text="resultData?.mobileVerifyData?.threeCheckResult"></wd-text>
              </view>
              <view class="item">
                运营商:{{ resultData?.mobileVerifyData?.operator || "" }}
              </view>
            </view>
            <view class="lastDesc">
              <wd-input class="flex-1" clearable v-model="unMatched" placeholder="若验证结果不是全匹配，柜员需填写说明..." />
              <wd-button type="success" :round="false" size="small" @click="unMatchedDesc">保存</wd-button>
            </view>
          </view>
          <view class="message">
            <view class="top">
              <view class="icon"></view>
              <view class="title">云互联</view>
              <wd-tag class="ml-10rpx" plain :type="resultData?.interCloudData?.interCloudResult == '查询成功'
                ? 'success'
                : 'danger'
                " size="small">{{
                  resultData?.interCloudData?.interCloudResult || ""
                }}</wd-tag>
            </view>
            <view class="bottom clound">
              <view class="left">
                <view class="item">
                  <img v-if="resultData?.interCloudData?.openCode == '红码'" src="/static/images/hongma.jpg" />
                  <img v-else-if="resultData?.interCloudData?.openCode == '绿码'" src="/static/images/lvma.jpg" />
                  <img v-else src="/static/images/huangma.jpg" />
                </view>
              </view>
              <view class="right">
                {{ resultData?.interCloudData?.openExceptCodeReason || "" }}
              </view>
            </view>

            <view class="lastDesc">
              <wd-input class="flex-1" clearable v-model="interCloudRecord" placeholder="此处填写备注说明..." />
              <wd-button type="success" :round="false" size="small" @click="cloudDesc">保存</wd-button>
            </view>
            <view class="lastDesc">
              <wd-picker class="flex-1" :columns="columnStatus" label="办理结果" v-model="status"
                @confirm="handleConfirmStatus" />
              <wd-button type="success" :round="false" size="small" @click="feedResult">保存</wd-button>
            </view>
          </view>
          <view class="message">
            <view class="top">
              <view class="icon"></view>
              <view class="title">两卡风险校验</view>
              <wd-tag class="ml-10rpx" plain :type="resultData?.riskVerifyData?.riskVerifyResult == '查询成功'
                ? 'success'
                : 'danger'
                " size="small">{{
                  resultData?.riskVerifyData?.riskVerifyResult || ""
                }}</wd-tag>
            </view>
            <view class="bottom">
              <view class="tag-box">
                <text :class="resultData?.riskVerifyData?.highRiskCustomer == '是'
                  ? 'cur'
                  : ''
                  ">高危客户：{{
                    resultData?.riskVerifyData?.highRiskCustomer || ""
                  }}</text>
                <text :class="resultData?.riskVerifyData?.doubtHighRiskCustomer == '是'
                  ? 'cur'
                  : ''
                  ">疑似高危客户：{{
                    resultData?.riskVerifyData?.doubtHighRiskCustomer || ""
                  }}</text>
                <text :class="resultData?.riskVerifyData?.isUnify == '否' ? 'cur' : ''
                  ">是否统一：{{
                    resultData?.riskVerifyData?.isUnify || ""
                  }}</text>
                <text>常住人口：{{
                  resultData?.riskVerifyData?.permPeople || ""
                }}</text>
                <text :class="resultData?.riskVerifyData?.floatPeople == '是' ? 'cur' : ''
                  ">流动人口：{{
                    resultData?.riskVerifyData?.floatPeople || ""
                  }}</text>
                <text>是否新开卡：{{
                  resultData?.riskVerifyData?.newOpenCard || ""
                }}</text>
                <text>一人多卡互译：{{
                  resultData?.riskVerifyData?.peopleMutualCardTrans || ""
                }}</text>
                <text>社保：{{
                  resultData?.riskVerifyData?.socialSecurity || ""
                }}</text>
                <text :class="resultData?.riskVerifyData?.bankRiskMode == '是'
                  ? 'cur'
                  : ''
                  ">银行风险模型：{{
                    resultData?.riskVerifyData?.bankRiskMode || ""
                  }}</text>
                <text>手机号活跃度：{{
                  resultData?.riskVerifyData?.phoneActivity || ""
                }}</text>
                <text>开卡活跃度全省等级：{{
                  resultData?.riskVerifyData?.provCardActivity || ""
                }}</text>
                <text>开卡活跃度全国等级：{{
                  resultData?.riskVerifyData?.contCardActivity || ""
                }}</text>
                <text :class="resultData?.riskVerifyData?.bankControl ? 'cur' : ''">银行管控：{{
                  resultData?.riskVerifyData?.bankControl || ""
                }}</text>
                <text :class="resultData?.riskVerifyData?.policeVerifycur ? 'cur' : ''
                  ">公安核查：{{
                    resultData?.riskVerifyData?.policeVerify || ""
                  }}</text>
              </view>
            </view>
            <wd-card>
              <view class="flex pt-10px mb-10px">
                <wd-text text="是否取现异常" color="#333" class="pl-15px pr-15px"></wd-text>
                <wd-radio-group shape="dot" inline checked-color="#00C192" v-model="qx.qxSfyc">
                  <wd-radio value="1">是</wd-radio>
                  <wd-radio value="2">否</wd-radio>
                </wd-radio-group>
              </view>
              <wd-input label="取现金额" clearable v-model="qx.qxJe" placeholder="取现金额..." />
              <wd-textarea label="异常说明" auto-height clearable v-model="qx.qxYcsm" placeholder="异常说明..." />
              <template #footer>
                <wd-button type="success" :round="false" size="small" @click="onSubmitQxYcsm">保存</wd-button>
              </template>
            </wd-card>
          </view>
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
            <wd-button icon="edit-outline" type="success" @click="submit">核实</wd-button>
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
  uni.navigateTo({ url: '/pages/handle/index?uuid=' + resultData.uuid })
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
      line-height: 1.2;
    }

    .icon {
      width: 8rpx;
      height: 40rpx;
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

      .cur {
        color: #ee0a24;
      }
    }

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
