<template>
  <view class="container">
    <view class="form-container">
      <wd-form ref="formRef" :model="form">
        <wd-cell-group border>
          <wd-input
            v-model="form.configName"
            label="配置名称"
            label-width="100px"
            prop="configName"
            clearable
            placeholder="请输入配置名称"
            :rules="[{ required: true, message: '请填写配置名称' }]"
          />
          <wd-input
            v-model="form.configKey"
            label="配置键"
            label-width="100px"
            prop="configKey"
            clearable
            placeholder="请输入配置键"
            :rules="[{ required: true, message: '请填写配置键' }]"
          />
          <wd-input
            v-model="form.configValue"
            label="配置值"
            label-width="100px"
            prop="configValue"
            clearable
            placeholder="请输入配置值"
            :rules="[{ required: true, message: '请填写配置值' }]"
          />
          <wd-input
            v-model="form.remark"
            label="描述、备注"
            label-width="100px"
            prop="remark"
            clearable
            placeholder="请输入描述或备注"
          />
        </wd-cell-group>
        <view class="footer">
          <view class="button-container">
            <wd-button type="primary" size="large" native-type="submit" block @click="handleSubmit">
              提交
            </wd-button>
            <wd-button v-if="form.id" type="error" size="large" block @click="handleDelete">
              删除
            </wd-button>
          </view>
        </view>
      </wd-form>
    </view>
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

onMounted(() => {
  console.log("Form ref:", formRef.value);
});

const handleSubmit = () => {
  console.log("点击了提交按钮");

  if (formRef.value) {
    formRef.value!.validate().then(({ valid, errors }) => {
      if (valid) {
        console.log("表单数据:", form.value);
        if (form.value.id) {
          // 如果 id 不为 null，调用更新 API
          ConfigAPI.update(form.value.id as number, form.value)
            .then((response) => {
              console.log("更新成功:", response);
              uni.showToast({
                title: "更新成功",
                icon: "success",
                duration: 2000,
              });
              uni.navigateBack();
            })
            .catch((error) => {
              console.error("更新失败:", error);
            });
        } else {
          // 如果 id 为 null，调用新增 API
          ConfigAPI.add(form.value)
            .then((response) => {
              console.log("提交成功:", response);
              uni.showToast({
                title: "提交成功",
                icon: "success",
                duration: 2000,
              });
              uni.navigateBack();
            })
            .catch((error) => {
              console.error("提交失败:", error);
            });
        }
      } else {
        console.log("表单验证未通过", errors);
      }
    });
  } else {
    console.error("Form ref is not defined");
  }
};
const handleDelete = () => {
  if (form.value.id !== undefined) {
    uni.showModal({
      title: "提示",
      content: "确定要删除此配置吗？",
      success: (res) => {
        if (res.confirm) {
          ConfigAPI.deleteById(form.value.id as number)
            .then((response) => {
              console.log("删除成功:", response);
              uni.showToast({
                title: "删除成功",
                icon: "success",
                duration: 2000,
              });
              uni.navigateBack();
            })
            .catch((error) => {
              console.error("删除失败:", error);
            });
        }
      },
    });
  } else {
    console.error("无效的 ID");
  }
};

// 定义接收的参数
const item = ref<ConfigPageVO | null>(null);

// 获取传递的参数
onLoad((options) => {
  console.log("接收到参数:", options);
  const title = options && options.item ? "编辑配置" : "新增配置";
  uni.setNavigationBarTitle({
    title: title,
  });
  if (options && options.item) {
    try {
      item.value = JSON.parse(decodeURIComponent(options.item));
      console.log("接收到的参数:", item.value);
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
  } else {
    console.log("没有接收到 item 参数");
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
