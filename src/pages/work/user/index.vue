<template>
  <wd-navbar title="用户管理">
    <template #left>
      <wd-icon name="thin-arrow-left" @click="handleNavigateback()" />
    </template>
    <template #right>
      <wd-icon name="add-circle" @click="handleOpenDialog()" />
    </template>
  </wd-navbar>
  <view class="user">
    <!-- 排序筛选 -->
    <view class="mb-24rpx">
      <wd-drop-menu>
        <wd-drop-menu-item v-model="sortValue" :options="sortOptions" @change="handleSortChange" />
        <wd-drop-menu-item ref="dropMenuRef" title="筛选">
          <view>
            <wd-input
              v-model="queryParams.keywords"
              label="关键字"
              placeholder="用户名/昵称/手机号"
            />
            <wd-datetime-picker v-model="createTimeRange" type="date" label="创建时间" />
            <view class="flex-between py-2">
              <wd-button class="w-20%" type="info" @click="hendleResetQuery">重置</wd-button>
              <wd-button class="w-70%" @click="handleQuery">确定</wd-button>
            </view>
          </view>
        </wd-drop-menu-item>
      </wd-drop-menu>
    </view>

    <!-- 用户卡片 -->
    <wd-card v-for="item in dataList">
      <template #title>
        <view class="flex-between">
          <view class="flex-center">
            <wd-img :width="50" :height="50" round :src="item.avatar" />
            <view class="ml-2">
              <view class="font-bold">
                {{ item.nickname }}
                <wd-icon v-if="item.gender == 1" name="gender-male" class="color-#4D80F0" />
                <wd-icon v-else-if="item.gender == 2" name="gender-female" class="color-#FA4350" />
              </view>
              <view class="mt-1"><wd-text :text="item.deptName" size="12px" /></view>
            </view>
          </view>
          <view>
            <wd-tag v-if="item.status === 1" type="success" plain>正常</wd-tag>
            <wd-tag v-else-if="item.status === 0" plain>禁用</wd-tag>
          </view>
        </view>
      </template>

      <wd-cell-group>
        <wd-cell title="用户名" :value="item.username" icon="user" />
        <wd-cell title="角色" :value="item.roleNames" icon="usergroup" />
        <wd-cell title="手机号码" :value="item.mobile" icon="mobile" />
        <wd-cell title="邮箱" :value="item.email" icon="mail" />
      </wd-cell-group>

      <template #footer>
        <wd-swipe-action>
          <view class="flex-between">
            <view>
              <wd-text text="创建时间：" size="12px" />
              <wd-text :text="item.createTime" size="12px" />
            </view>
            <view>
              <wd-button size="small" plain @click="handleOpenDialog(item.id)">编辑</wd-button>
            </view>
          </view>

          <template #right>
            <wd-button type="error" plain size="small" @click="handleDelete(item.id)">
              删除
            </wd-button>
          </template>
        </wd-swipe-action>
      </template>
    </wd-card>

    <wd-loadmore v-if="total > 0" :state="state" @reload="loadmore" />
    <wd-message-box />

    <!-- 编辑弹窗 -->
    <wd-popup v-model="dialog.visible" position="bottom" @close="hancleCloseDialog">
      <wd-form ref="userFormRef" :model="formData" :rules="rules">
        <wd-cell-group border>
          <wd-input v-model="formData.username" label="用户名" :readonly="!formData.id" required />
          <wd-input v-model="formData.nickname" label="昵称" required />
          <wd-select-picker
            v-model="formData.roleIds"
            label="角色"
            :columns="roleOptions"
            required
          />
          <vut-picker
            v-model="formData.deptId"
            v-model:data="deptOptions"
            label="部门"
            :required="true"
          />
          <wd-input v-model="formData.mobile" label="手机号" prop="mobile" />
          <wd-input v-model="formData.email" label="邮箱" prop="email" />
          <wd-cell title="状态">
            <wd-switch v-model="formData.status" :active-value="1" :inactive-value="0" required />
          </wd-cell>
        </wd-cell-group>
      </wd-form>
      <view class="footer">
        <wd-button type="primary" block @click="handleSubmit">提交</wd-button>
      </view>
    </wd-popup>

    <wd-loading v-show="loading" />
    <!-- <wd-fab position="left-bottom" :expandable="false" @click="handleOpenDialog" /> -->
  </view>
</template>

<script lang="ts" setup>
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import { FormRules } from "wot-design-uni/components/wd-form/types";
import { useMessage, dayjs } from "wot-design-uni";

import UserAPI, { type UserPageQuery, UserPageVO, UserForm } from "@/api/system/user";
import RoleAPI from "@/api/system/role";
import DeptAPI from "@/api/system/dept";

import VutPicker from "@/components/VutPicker.vue";

const message = useMessage();

const loading = ref(false);
const state = ref<LoadMoreState>("loading");
const dataList = ref<UserPageVO[]>([]);

const sortValue = ref(1);
const sortOptions = ref<Record<string, any>[]>([
  { label: "最近创建", value: 1 },
  { label: "最近更新", value: 2 },
]);

const queryParams: UserPageQuery = {
  pageNum: 1,
  pageSize: 10,
};

const createTimeRange = ref<any[]>([null, null]);

const dropMenuRef = ref();

const total = ref(0);
const dialog = reactive({
  visible: false,
});

const initialFormData: UserForm = {
  id: undefined,
  roleIds: [],
  username: undefined,
  nickname: undefined,
  deptId: undefined,
  mobile: undefined,
  email: undefined,
  status: 1,
};

const formData = reactive<UserForm>({ ...initialFormData });

const userFormRef = ref();
const roleOptions = ref<Record<string, any>[]>([]);
const deptOptions = ref<OptionType[]>([]);

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名" }],
  nickname: [{ required: true, message: "请输入昵称" }],
  roleIds: [{ required: true, message: "请选择角色" }],
  deptId: [{ required: true, message: "请选择部门" }],
  status: [{ required: true, message: "请选择状态" }],
  mobile: [
    {
      required: false,
      message: "手机号格式不正确",
      validator: (value) => {
        if (!value) {
          return Promise.resolve();
        }
        if (!/^1[3456789]\d{9}$/.test(value)) {
          return Promise.reject("手机号格式不正确");
        } else {
          return Promise.resolve();
        }
      },
    },
  ],
  email: [
    {
      required: false,
      message: "邮箱格式不正确",
      validator: (value) => {
        if (!value) {
          return Promise.resolve();
        }
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
          return Promise.reject("邮箱格式不正确");
        } else {
          return Promise.resolve();
        }
      },
    },
  ],
};

/**
 * 排序改变
 */
const handleSortChange = ({ value }: { value: number }) => {
  if (value === 1) {
    queryParams.field = "create_time";
    queryParams.direction = "DESC";
  } else if (value === 2) {
    queryParams.field = "update_time";
    queryParams.direction = "DESC";
  }
  handleQuery();
};

/**
 * 查询
 */
const handleQuery = () => {
  dropMenuRef.value?.close();
  queryParams.pageNum = 1;

  // 格式化时间范围
  const startDate = createTimeRange.value[0]
    ? dayjs(createTimeRange.value[0]).format("YYYY-MM-DD")
    : "";
  const endDate = createTimeRange.value[1]
    ? dayjs(createTimeRange.value[1]).format("YYYY-MM-DD")
    : "";

  queryParams.createTime = [startDate, endDate];

  // #ifdef MP-WEIXIN
  queryParams.createTime = `${startDate},${endDate}`;
  // #endif

  loadmore();
};

/**
 * 重置查询
 */
const hendleResetQuery = () => {
  dropMenuRef.value?.close();
  queryParams.pageNum = 1;
  queryParams.keywords = "";
  createTimeRange.value = ["", ""];
  loadmore();
};

/**
 * 加载更多
 */
function loadmore() {
  state.value = "loading";
  UserAPI.getPage(queryParams)
    .then((data) => {
      dataList.value = data.list;
      total.value = data.total;
      queryParams.pageNum++;
    })
    .finally(() => {
      state.value = "finished";
    });
}

/**
 * 打开弹窗
 */
async function handleOpenDialog(id?: number) {
  loading.value = true;
  dialog.visible = true;
  roleOptions.value = await RoleAPI.getOptions();
  deptOptions.value = await DeptAPI.getOptions();
  if (id) {
    UserAPI.getFormData(id)
      .then((data) => {
        Object.assign(formData, { ...data });
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    loading.value = false;
  }
}

/**
 * 提交保存
 */
function handleSubmit() {
  hancleCloseDialog();
  userFormRef.value.validate().then(({ valid }: { valid: boolean }) => {
    if (valid) {
      const userId = formData.id;
      if (userId) {
        UserAPI.update(userId, formData).then(() => {
          message.show("修改成功");
          hancleCloseDialog();
          handleQuery();
        });
      } else {
        UserAPI.add(formData).then(() => {
          message.show("添加成功");
          hancleCloseDialog();
          handleQuery();
        });
      }
    }
  });
}

// 重置表单
function resetForm() {
  userFormRef.value.reset();
  Object.assign(formData, initialFormData);
}

// 关闭弹窗
function hancleCloseDialog() {
  dialog.visible = false;
  resetForm();
}

/**
 * 删除
 *
 * @param id  用户id
 */
function handleDelete(id: number) {
  message
    .confirm({
      msg: "确认删除用户吗？",
      title: "提示",
    })
    .then(() => {
      UserAPI.deleteByIds(id + "").then(() => {
        message.show("删除成功");
        handleQuery();
      });
    });
}

/**
 * 返回
 */
function handleNavigateback() {
  uni.navigateBack();
}

// 触底事件
onReachBottom(() => {
  if (queryParams.pageNum * queryParams.pageSize < total.value) {
    loadmore();
  } else if (queryParams.pageNum * queryParams.pageSize >= total.value) {
    state.value = "finished";
  }
});

onLoad(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
.user {
  :deep(.wd-cell__wrapper) {
    padding: 4rpx 0;
  }
  :deep(.wd-cell) {
    padding-right: 10rpx;
    background: #f8f8f8;
  }
}
</style>
