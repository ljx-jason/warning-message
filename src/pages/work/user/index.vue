<template>
  <view class="user">
    <!-- 筛选 -->
    <wd-drop-menu>
      <wd-drop-menu-item v-model="sortValue" :options="sortOptions" @change="handleSortChange" />
      <wd-drop-menu-item ref="dropMenuRef" title="筛选">
        <view>
          <wd-input
            v-model="queryParams.keywords"
            label="关键字"
            type="text"
            placeholder="请输入关键字"
          />
          <wd-datetime-picker v-model="daterange" label="创建时间" />
        </view>
      </wd-drop-menu-item>
    </wd-drop-menu>

    <wd-card v-for="item in dataList" class="user-card">
      <template #title>
        <view class="flex-between">
          <view class="flex-center">
            <wd-img :width="50" :height="50" round :src="item.avatar" />
            <view class="ml-2">
              <view class="font-bold">
                {{ item.nickname }}
                <wd-icon v-if="item.gender == 1" name="gender-male" class="color-#4D80F0" />
                <wd-icon v-else-if="item.gender == 2" name="gender-female" class="color-#fa4350" />
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
        <view class="flex-between">
          <view>
            <wd-text text="创建时间：" size="12px" />
            <wd-text :text="item.createTime" size="12px" />
          </view>
          <view>
            <wd-button size="small" plain @click="handleOpenDialog(item.id)">编辑</wd-button>
            <wd-button type="error" plain size="small" class="ml-2" @click="handleDelete(item.id)">
              删除
            </wd-button>
          </view>
        </view>
      </template>
    </wd-card>

    <wd-loadmore :state="state" @reload="loadmore" />
    <wd-message-box />
    <wd-popup v-model="dialog.visible" position="bottom">
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
  </view>
</template>

<script lang="ts" setup>
import { LoadMoreState } from "wot-design-uni/components/wd-loadmore/types";
import { FormRules } from "wot-design-uni/components/wd-form/types";

import UserAPI, { type UserPageQuery, UserPageVO, UserForm } from "@/api/system/user";
import RoleAPI from "@/api/system/role";
import DeptAPI from "@/api/system/dept";
import VutPicker from "@/components/VutPicker.vue";

import { useMessage } from "wot-design-uni";

const message = useMessage();

const state = ref<LoadMoreState>("loading"); // 加载状态 loading, finished:, error
const dataList = ref<UserPageVO[]>([]);

const queryParams: UserPageQuery = {
  pageNum: 1,
  pageSize: 10,
};

const daterange = ref<any[]>(["", Date.now()]);

const total = ref(0);

const dialog = reactive({
  visible: false,
});

const formData = reactive<UserForm>({
  roleIds: [],
});

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  roleIds: [{ required: true, message: "请选择角色", trigger: "blur" }],
  deptId: [{ required: true, message: "请选择部门", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  mobile: [
    { required: false, pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
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

const userFormRef = ref();
const roleOptions = ref<Record<string, any>[]>([]);
const deptOptions = ref<OptionType[]>([]);

const sortValue = ref(1);

const sortOptions = ref<Record<string, any>[]>([
  { label: "最近创建", value: 1 },
  { label: "最近更新", value: 2 },
]);

/**
 * 排序改变
 */
const handleSortChange = ({ value }: { value: number }) => {
  console.log("排序", value);
  queryParams.pageNum = 1;

  if (value === 1) {
    queryParams.field = "create_time";
    queryParams.direction = "DESC";
  } else if (value === 2) {
    queryParams.field = "update_time";
    queryParams.direction = "DESC";
  }

  loadmore();
};

onReachBottom(() => {
  if (queryParams.pageNum * queryParams.pageSize < total.value) {
    loadmore();
  } else if (queryParams.pageNum * queryParams.pageSize >= total.value) {
    state.value = "finished";
  }
});

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
 * 加载角色下拉项
 */
async function loadRoleOptions() {
  RoleAPI.getOptions().then((data) => {
    roleOptions.value = data;
  });
}

/**
 * 加载部门下拉项
 */
async function loadDeptOptions() {
  DeptAPI.getOptions().then((data) => {
    deptOptions.value = data;
  });
}

/**
 * 打开弹窗
 */
async function handleOpenDialog(id?: number) {
  dialog.visible = true;
  await loadRoleOptions();
  await loadDeptOptions();
  if (id) {
    UserAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data });
    });
  }
}

/**
 * 提交保存
 */
function handleSubmit() {
  console.log("提交", formData);
  userFormRef.value.validate().then(({ valid }: { valid: boolean }) => {
    if (valid) {
      const userId = formData.id;
      if (userId) {
        UserAPI.update(userId, formData).then(() => {
          message.show("修改成功");
          dialog.visible = false;
          queryParams.pageNum = 1;
          loadmore();
        });
      } else {
        UserAPI.add(formData).then(() => {
          message.show("添加成功");
          dialog.visible = false;
          queryParams.pageNum = 1;
          loadmore();
        });
      }
    }
  });
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
        queryParams.pageNum = 1;
        loadmore();
      });
    })
    .catch(() => {
      console.log("点击了取消按钮");
    });
}

onLoad(() => {
  loadmore();
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}
/* stylelint-enable selector-type-no-unknown */

.custom-class {
  display: flex;
  flex-direction: col;
  align-items: center;
  width: 230rpx;
  height: 80rpx;
}

.user-card {
  margin-top: 20rpx;
  :deep(.wd-cell__wrapper) {
    padding: 8rpx 0;
  }

  :deep(.wd-cell) {
    padding-right: 10rpx;
    background: #f5f5f5;
  }
}
</style>
