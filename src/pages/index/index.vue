<template>
  <view class="home-container">
    <view class="container">
      <Header />
      <view class="home">
        <view>
          <view class="title">
            <view><img src="/static/images/user.png" alt="" /><span>客户信息</span></view>
          </view>
          <wd-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
            <wd-cell-group border>
              <wd-input label="证件号" label-width="80px" prop="cardId" v-model="ruleForm.cardId" placeholder="请输入证件号">
                <template #suffix><wd-upload :file-list="fileList" :reupload="true" :upload-method="customUpload">
                    <wd-icon name="scan" size="22px" v-show="scan"></wd-icon>
                  </wd-upload></template>
              </wd-input>
              <wd-input label="姓名" label-width="80px" prop="cardName" clearable v-model="ruleForm.cardName"
                placeholder="请输入客户姓名" />
              <wd-input label="银行卡号" label-width="80px" prop="cardNum" clearable v-model="ruleForm.cardNum"
                placeholder="请输入银行卡号" />
              <wd-input label="手机号" label-width="80px" prop="phone" clearable v-model="ruleForm.phone"
                placeholder="请输入手机号" />
              <wd-input label="固定电话" label-width="80px" prop="tel" clearable v-model="ruleForm.tel"
                placeholder="请输入固定电话" />
              <wd-text class="ml-100px" size="12px" text="(仅限特殊孤寡老人使用)"></wd-text>
              <wd-checkbox class="ml-12px" v-model="checked" checked-color="#00C192">非本人手机</wd-checkbox>
            </wd-cell-group>
            <wd-cell-group v-if="checked" border>
              <wd-input label="证件号" label-width="80px" prop="reCardId" clearable v-model="ruleForm.reCardId"
                placeholder="请输入证件号" />
              <wd-input label="姓名" label-width="80px" prop="reCardName" clearable v-model="ruleForm.reCardName"
                placeholder="请输入客户姓名" />
              <wd-picker :columns="columns" label-width="80px" label="关系描述" v-model="ruleForm.relation"
                @confirm="handleConfirm" />
            </wd-cell-group>
          </wd-form>
        </view>
        <view class="p-l-10px p-r-10px">
          <view class="title">
            <view><img src="/static/images/audit.png" alt="" /><span>业务种类</span></view>
          </view>
          <wd-checkbox-group v-model="kindResult" checked-color="#00C192" inline @change="kindResultChange">
            <wd-checkbox v-for="item in kindData" :modelValue="item.value" @click="itemClick(item)">{{ item.label
            }}</wd-checkbox>
            <view class="last">
              <wd-checkbox modelValue="l">其他</wd-checkbox>
              <wd-input v-model="ruleForm.businessTypeDesc" :disabled="disabled" placeholder="输入业务名称" />
            </view>
          </wd-checkbox-group>
        </view>
        <view class="p-l-10px p-r-10px">
          <view class="title">
            <view><img src="/static/images/audit.png" alt="" /><span>办理目的</span></view>
          </view>
          <wd-checkbox-group v-model="handleGoal" checked-color="#00C192" inline>
            <wd-checkbox v-for="item in handleData" :modelValue="item.value" @click="itemClick(item)">{{ item.label
            }}</wd-checkbox>
            <view class="lasts">
              <wd-checkbox modelValue="5">工资代发</wd-checkbox>
              <wd-input v-model="ruleForm.salaryProxy" placeholder="填写单位名称" />
            </view>
            <view class="last">
              <wd-checkbox modelValue="6">其他</wd-checkbox>
              <wd-input v-model="ruleForm.goalOtherDesc" placeholder="请输入" />
            </view>
          </wd-checkbox-group>
        </view>
        <view class="p-l-10px p-r-10px">
          <view class="title">
            <view><img src="/static/images/fileSearch.png" alt="" /><span>查询选择</span></view>
          </view>
          <wd-checkbox-group v-model="searchResult" checked-color="#00C192" inline>
            <wd-checkbox v-for="item in searchData" :modelValue="item.value">{{ item.label
            }}</wd-checkbox>
          </wd-checkbox-group>
        </view>
        <view class="footer">
          <wd-button icon="refresh" type="success" plain @click="reset">重置</wd-button>
          <wd-button icon="search" type="success" @click="search">查询</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { pressorImg } from "@/utils/index";
import MainAPI from "@/api/main";
import Header from "@/components/header/index.vue";

const ruleForm = reactive({
  gyh: uni.getStorageSync("gyh"),
  cardId: "",
  cardName: "",
  phone: "",
  reCardId: "",
  reCardName: "",
  relation: "",
  queryContent: "",
  bussType: "",
  queryOption: "",
  isSelf: 0,
  tel: "",
  cardNum: "",
  businessTypeDesc: "",
  salaryProxy: "",
  goalOtherDesc: "",
})
const rules = {
  cardId: [
    {
      required: true,
      pattern: /\d{18}/,
      message: '请输入18位的证件号',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject('请填写证件号')
        }
      }
    }
  ],
  cardName: [
    {
      required: true,
      message: '请填写姓名',
      validator: (value) => {
        if (value && value.length > 1) {
          return Promise.resolve()
        } else {
          return Promise.reject('姓名格式需为二个字符或二个字符以上')
        }
      }
    }
  ],
  phone: [
    {
      required: true,
      pattern: /^1[3456789]\d{9}$/,
      message: '请填写正确格式手机号',
      validator: (value) => {
        if (value) {
          return Promise.resolve()
        } else {
          return Promise.reject('请填写手机号')
        }
      }
    }
  ],
}
const ruleFormRef = ref();
const reset = () => {
  kindResult.value = [];
  searchResult.value = []
  for (const key in ruleForm) {
    if (key === 'gyh' || key === 'isSelf') continue;
    ruleForm[key] = "";
  }
  nextTick(() => {
    ruleFormRef.value?.reset();
  });
}
const search = async () => {
  ruleFormRef.value.validate().then(async ({ valid }) => {
    if (valid) {
      if (ruleForm.cardNum) {
        let data = await MainAPI.getBasicInfoList({ cardNum: ruleForm.cardNum });
        if (data.status == 0) {
          ruleForm.cardName = data.data.idName;
          ruleForm.phone = data.data.phone;
          ruleForm.cardId = data.data.idNo;
        } else {
          uni.showToast({
            title: data.msg,
            icon: 'none'
          });
        }
      }
      if (!checkRule()) {
        return false;
      }
      let containArr;
      if (scan.value) {
        // containArr = ['a', 'c', 'e']
        containArr = ["a", "b", "c", "d"];
      } else {
        containArr = ["a", "b", "c", "d"];
      }

      let selectedArr = [0, 0, 0, 0];
      searchResult.value.forEach((item) => {
        if (containArr.includes(item.value)) {
          selectedArr[item.index] = 1;
        }
      });
      let sys = selectedArr[0] // 手机号码三要素
      let yhl = selectedArr[1] // 云互联
      let lk = selectedArr[2] // 两卡风险校验
      let qrt = selectedArr[3] // 衢融通预警
      let arrList = [sys, 1, yhl, 1, 0, 1, qrt, lk]
      ruleForm.queryContent = arrList.join("");
      let bussType = [];
      kindResult.value.forEach((item) => {
        if (item.label) {
          bussType.push(item.label);
        }
      });
      if (ruleForm.businessTypeDesc) {
        bussType.push("其他");
      }
      let queryOptions: any[] = [];
      searchResult.value.forEach((item) => {
        queryOptions.push(item.label);
      });
      let handleGoals = [];
      handleGoal.value.forEach((item) => {
        if (item.value) {
          handleGoals.push(item.value);
        }
      });
      if (ruleForm.salaryProxy) {
        handleGoals.push("5");
      }
      if (ruleForm.goalOtherDesc) {
        handleGoals.push("6");
      }
      let queryData = {
        ...ruleForm,
        isSelf: checked.value ? 0 : 1,
        reCardId: checked.value ? ruleForm.reCardId : "",
        reCardName: checked.value ? ruleForm.reCardName : "",
        relation: checked.value ? ruleForm.relation : "",
        bussType: bussType.join(","),
        queryOption: queryOptions.join(","),
        handleGoal: handleGoals.join(","),
      };
      console.log(queryData);
      const p = encodeURIComponent(JSON.stringify(queryData))
      uni.navigateTo({
        url: '/pages/result/index?data=' + p
      })
    }
  })
}

const checkRule = () => {
  let failMsg: string[] = [];
  searchResult.value.forEach((item) => {
    if (item.grayColor) {
      failMsg.push(`<${item.label}>\n`);
    }
  });
  if (failMsg.length > 0) {
    uni.showToast({
      title: "下列必选查询项未选\n请勾选后再查询\n" + failMsg.join(""),
      icon: "none",
    });
    return false;
  }

  if (checked.value) {
    if (!ruleForm.reCardId) {
      uni.showToast({
        title: "请填写证件号",
        icon: "none",
      });
      return false;
    }
    if (ruleForm.reCardId.length < 18) {
      uni.showToast({
        title: "请输入18位的证件号",
        icon: "none",
      });
      return false;
    }
    if (!ruleForm.reCardName) {
      uni.showToast({
        title: "请填写姓名",
        icon: "none",
      });
      return false;
    }
    if (ruleForm.reCardName.length < 2) {
      uni.showToast({
        title: "姓名格式需为二个字符或二个字符以上",
        icon: "none",
      });
      return false;
    }
  }

  if (kindResult.value.includes("l")) {
    if (!ruleForm.businessTypeDesc) {
      uni.showToast({
        title: "请填写业务名称",
        icon: "none",
      });
      return false;
    }
  }
  if (ruleForm.businessTypeDesc) {
    if (!kindResult.value.includes("l")) {
      uni.showToast({
        title: "请勾选其他选项",
        icon: "none",
      });
      return false;
    }
  }
  if (handleGoal.value.includes("5")) {
    if (!ruleForm.salaryProxy) {
      uni.showToast({
        title: "请填写工资代发信息",
        icon: "none",
      });
      return false;
    }
  }
  if (ruleForm.salaryProxy) {
    if (!handleGoal.value.includes("5")) {
      uni.showToast({
        title: "请勾选工资代发选项",
        icon: "none",
      });
      return false;
    }
  }
  if (handleGoal.value.includes("6")) {
    if (!ruleForm.goalOtherDesc) {
      uni.showToast({
        title: "请添加其他描述信息",
        icon: "none",
      });
      return false;
    }
  }
  if (ruleForm.goalOtherDesc) {
    if (!handleGoal.value.includes("6")) {
      uni.showToast({
        title: "请勾选其他描述信息",
        icon: "none",
      });
      return false;
    }
  }
  return true;
}

const checked = ref(false)
const scan = ref(true)
const disabled = ref(false)
const kindResult = ref([])
const handleGoal = ref([])
const searchResult = ref([])
const kindData = ref([
  { label: "新开户", value: "a" },
  { label: "不动户转回", value: "b" },
  { label: "挂失补卡", value: "c" },
  { label: "账户升级", value: "d" },
  { label: "手机号码变更", value: "e" },
  { label: "开通/提高非柜面", value: "f" },
  { label: "账户启用", value: "g" },
  { label: "取现", value: "h" },
  { label: "账户解控", value: "i" },
])
const handleData = ref([
  { label: "个人资金结算", value: "1" },
  { label: "贷款", value: "2" },
  { label: "公共缴费", value: "3" },
  { label: "投资理财", value: "4" },
])
const searchData = ref([
  { label: "手机号码三要素", value: "a", index: 0 },
  { label: "云互联", value: "b", index: 1 },
  { label: "两卡风险校验", value: "c", index: 2 },
  // { label: "衢融通预警", value: "d", index: 3 },
])
const columns = ref(['父母', '子女', '配偶', '祖父母', '其他关系人'])
const handleConfirm = (val: any) => {
  ruleForm.relation = val;
}
const fileList = ref([])
const customUpload = async (file: any) => {
  const result = await pressorImg(file);
  console.log("pressorImg file", result);
  if (!result) {
    return uni.showToast({
      title: "图片压缩失败",
      icon: "none",
    });
  }
  const formData = new FormData();
  formData.append('file', result);
  formData.append('gyh', ruleForm.gyh);

  uni.showLoading({
    title: '正在识别身份证信息...',
    mask: true,
  });

  const data = await MainAPI.getIdCardInfo(formData);
  if (data.data) {
    ruleForm.cardId = data.data.idNo;
    ruleForm.cardName = data.data.name;
  }
  uni.hideLoading();
}
const itemClick = () => {
  searchResult.value = [];
  // 开通/提高非柜面
  let accountIndex = kindResult.value.findIndex((item: any) => {
    return item.value == "f" || item.value == "h" || item.value == "i";
  });
  let otherIndex = kindResult.value.findIndex((item: any) => {
    return (
      item.value == "a" ||
      item.value == "b" ||
      item.value == "c" ||
      item.value == "d" ||
      item.value == "e" ||
      item.value == "g"
    );
  });

  if (accountIndex > -1) {
    searchData.value.forEach((item) => {
      searchData.value.push(item);
    });
  }
  if (otherIndex > -1) {
    searchData.value.forEach((item) => {
      if (item.value != "d") {
        searchData.value.push(item);
      }
    });
  }
}
const kindResultChange = (val: any) => {
  if (val.length == 0) {
    searchResult.value.forEach((item: any) => {
      item.grayColor = false;
    });
    searchResult.value = [];
  }
}
onReady(() => {
  if (!uni.getStorageSync("gyh")) {
    uni.showModal({
      title: "提示",
      content: "请先登录",
      success: function (res) {
        if (res.confirm) {
          uni.reLaunch({ url: "/pages/login/index" })
        }
      },
    });
  }
})
</script>

<style setup lang="scss">
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

  .title {
    display: flex;
    justify-content: center;
    margin: 24rpx 0;

    img {
      position: relative;
      top: 4px;
      width: 24rpx;
      height: 32rpx;
    }

    span {
      margin-left: 10rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 30rpx 0;
  }

  :deep(.wd-checkbox__txt) {
    overflow: visible;
  }
}
</style>
