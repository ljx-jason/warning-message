<template>
  <view class="form-container">
    <wd-form ref="formRef" :model="form">
      <wd-cell-group border>
        <wd-input
          v-model="form.configName"
          label="配置名称"
          label-width="100px"
          label-align="right"
          prop="configName"
          clearable
          placeholder="请输入配置名称"
          :rules="[{ required: true, message: '请填写配置名称' }]"
        />
        <wd-input
          v-model="form.configKey"
          label="配置键"
          label-width="100px"
          label-align="right"
          prop="configKey"
          clearable
          placeholder="请输入配置键"
          :rules="[{ required: true, message: '请填写配置键' }]"
        />
        <wd-input
          v-model="form.configValue"
          label="配置值"
          label-width="100px"
          label-align="right"
          prop="configValue"
          clearable
          placeholder="请输入配置值"
          :rules="[{ required: true, message: '请填写配置值' }]"
        />
        <wd-textarea
          v-model="form.remark"
          prop="remark"
          label="配置描述"
          label-align="right"
          clearable
          :maxlength="100"
          show-word-limit
          label-width="100px"
          placeholder="请输入配置描述"
        />
      </wd-cell-group>
      <view class="footer">
        <view class="button-container">
          <wd-button type="info" size="large" block @click="handleBack">返回</wd-button>
          <wd-button
            type="primary"
            size="large"
            native-type="submit"
            :disabled="subDisable"
            block
            @click="handleSubmit"
          >
            提交
          </wd-button>
        </view>
      </view>
    </wd-form>
  </view>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import ConfigAPI, { ConfigForm, ConfigPageVO } from "@/api/system/config";
import { FormInstance } from "wot-design-uni/components/wd-form/types";

const form = ref<ConfigForm>({
  id: undefined,
  configName: "",
  configKey: "",
  configValue: "",
  remark: "",
});

const formRef = ref<FormInstance>();
const subDisable = ref(false);

/**
 * 返回
 */
const handleBack = () => {
  uni.navigateBack();
};

/**
 * 提交
 */
const handleSubmit = () => {
  subDisable.value = true;
  if (formRef.value) {
    formRef.value!.validate().then(({ valid, errors }) => {
      if (valid) {
        if (form.value.id) {
          // 如果 id 不为 null，调用更新 API
          ConfigAPI.update(form.value.id as number, form.value)
            .then((response) => {
              uni.showToast({
                title: "更新成功",
                icon: "success",
                duration: 2000,
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 2000);
            })
            .catch((error) => {
              console.error("更新失败:", error);
              subDisable.value = false;
            });
        } else {
          // 如果 id 为 null，调用新增 API
          ConfigAPI.add(form.value)
            .then((response) => {
              uni.showToast({
                title: "提交成功",
                icon: "success",
                duration: 2000,
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 2000);
            })
            .catch((error) => {
              console.error("提交失败:", error);
              subDisable.value = false;
            });
        }
      } else {
        uni.showToast({
          title: "请按照要求填写表单",
          icon: "error",
          duration: 2000,
        });
        subDisable.value = false;
      }
    });
  }
};

// 定义接收的参数
const item = ref<ConfigPageVO | null>(null);

// 获取传递的参数
onLoad((options) => {
  const title = options && options.item ? "编辑配置" : "新增配置";
  uni.setNavigationBarTitle({
    title: title,
  });
  if (options && options.item) {
    try {
      item.value = JSON.parse(decodeURIComponent(options.item));
      if (item.value) {
        form.value = {
          id: item.value.id,
          configName: item.value.configName,
          configKey: item.value.configKey,
          configValue: item.value.configValue,
          remark: item.value.remark,
        };
      }
    } catch (error) {
      console.error("解析参数失败:", error);
    }
  }
});
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40rpx;
  background: #f8f8f8;
}

.form-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 40rpx;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.button-container .wd-button {
  flex: 1;
  margin: 0 5px; /* 调整按钮之间的间距 */
}

.wd-cell-group {
  margin-bottom: 20rpx;
}

.wd-button {
  width: 100%;
  margin-top: 10rpx; /* 调整按钮间距 */
}
</style>
