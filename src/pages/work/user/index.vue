<template>
  <view class="user">
    <wd-search v-model="queryParams.keywords" :maxlength="10" class="mb-2" />

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

          <wd-picker
            v-model="selectedDeptIds"
            label="部门"
            :columns="deptPickerColumns"
            :display-format="displayFormat"
            :column-change="handleDeptChange"
            required
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

import { useMessage } from "wot-design-uni";

const message = useMessage();

const state = ref<LoadMoreState>("loading"); // 加载状态 loading, finished:, error
const dataList = ref<UserPageVO[]>([]);

const queryParams: UserPageQuery = {
  pageNum: 1,
  pageSize: 10,
};

const total = ref(0); // 总数

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

const selectedDeptIds = ref<number[]>([]);

const roleOptions = ref<Record<string, any>[]>([]);

const deptPickerColumns = ref<Array<Array<{ label: string; value: string | number }>>>([]);

onReachBottom(() => {
  if (queryParams.pageNum * queryParams.pageSize < total.value) {
    loadmore();
  } else if (queryParams.pageNum * queryParams.pageSize >= total.value) {
    state.value = "finished";
  }
});

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

let deptList: Record<string, any>[] = [];
/**
 * 加载部门下拉项
 */
async function loadDeptOptions() {
  DeptAPI.getOptions().then((data) => {
    // 将data转为json格式
    console.log("原始数据", JSON.stringify(data));
    deptList = data;
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
      const deptId = data.deptId;
      if (deptId) {
        selectedDeptIds.value = findDept(deptId, deptList);
        deptPickerColumns.value = transformTreeToColumns(deptList, selectedDeptIds.value);
      }
    });
  } else {
    // 如果没有id，则初始化为空，选择默认的第一项
    deptPickerColumns.value = transformTreeToColumns(deptList, []);
  }
}

/**
 * 将树形数据转换为 Picker 所需的 columns 格式
 *
 * 示例 treeData 数据格式：[{"value":"1","label":"有来技术","children":[{"value":"2","label":"研发部门"},{"value":"3","label":"测试部门"}]},{"value":"4","label":"无回科技","children":[{"value":"5","label":"市场部"}]}
 *
 * 示例 columns 数据格式：
 *   - 一级选择 selectedDeptIds 为 [1, 3] 的有来技术1，那么二级就只有有来技术下的部门：研发部和测试部，没有市场部
 *   - [[{"label":"有来技术","value":"1"},{"label":"无回科技","value":"4"}], [{"label":"研发部门","value":"2"},{"label":"测试部门","value":"3"}]]
 *
 * @param treeData 原始树形数据
 * @param selectedDeptIds 选中的部门ID数组
 * @returns 转换后的 columns 数据
 */
/**
 * 将树形数据转换为 Picker 所需的 columns 格式
 *
 * @param treeData 原始树形数据
 * @param selectedDeptIds 已选择的部门ID数组
 * @returns 转换后的 columns 数据
 */
/**
 * 将树形数据转换为 Picker 所需的 columns 格式
 *
 * @param treeData 原始树形数据
 * @param selectedDeptIds 已选择的部门ID数组
 * @returns 转换后的 columns 数据
 */
const transformTreeToColumns = (
  treeData: Record<string, any>[],
  selectedDeptIds: (string | number)[]
): Array<Array<{ label: string; value: string | number }>> => {
  const columns: Array<Array<{ label: string; value: string | number }>> = [];
  let currentNodes = treeData; // 当前层级的节点

  for (let depth = 0; depth <= selectedDeptIds.length; depth++) {
    const currentColumn: Array<{ label: string; value: string | number }> = [];
    currentNodes.forEach((node) => {
      currentColumn.push({ label: node.label, value: node.value });
    });

    // 如果当前列数据为空，停止后续列生成
    if (currentColumn.length === 0) break;

    // 确保选中值有效，如果无效则选中该列的第一个值
    const selectedId = selectedDeptIds[depth];
    if (!currentColumn.some((item) => item.value === selectedId)) {
      selectedDeptIds[depth] = currentColumn[0]?.value; // 选中第一个值
    }

    // 添加当前列到 columns
    columns.push(currentColumn);

    // 获取下一层数据
    const selectedNode = currentNodes.find((node) => node.value === selectedDeptIds[depth]);
    currentNodes = selectedNode?.children || [];
  }

  return columns;
};

const displayFormat = (items: any) => {
  // 检查 items 是否有内容，直接返回最后一个子节点的 label
  return items.length > 0 ? items[items.length - 1].label : "";
};

/**
 *
 * 根据deptId查找部门树路径
 *
 * [{"value":"1","label":"有来技术","children":[{"value":"2","label":"研发部门"},{"value":"3","label":"测试部门"}]},{"value":"4","label":"无回科技","children":[{"value":"5","label":"市场部"}]}
 * 例如：查找部门id为3 的路径 ,返回结果为 [1,3]
 */
const findDept = (deptId: number, deptList: Record<string, any>[]): number[] => {
  const path: number[] = []; // 用于存储部门路径

  // 递归查找部门路径
  const find = (deptId: number, deptList: Record<string, any>[]): boolean => {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i];

      // 如果找到了目标部门
      if (dept.value == deptId) {
        path.push(deptId); // 将目标部门ID添加到路径数组中
        return true; // 返回找到的标志
      }

      // 如果当前部门有子部门，则递归查找
      if (dept.children && dept.children.length > 0) {
        path.push(dept.value); // 添加当前部门到路径数组
        if (find(deptId, dept.children)) {
          return true; // 找到后返回
        }
        path.pop(); // 如果没有找到目标部门，回退当前部门
      }
    }
    return false; // 如果没找到目标部门，返回false
  };

  // 执行查找
  find(deptId, deptList);
  return path; // 返回部门路径
};

/**
 * 处理部门选择
 * @param pickerView
 * @param value
 * @param columnIndex
 * @param resolve
 */
function handleDeptChange(
  pickerView: PickerViewInstance,
  value: Record<string, any> | Record<string, any>[],
  columnIndex: number,
  resolve: () => void
) {
  formData.deptId =
    selectedDeptIds.value.length > 0
      ? selectedDeptIds.value[selectedDeptIds.value.length - 1]
      : undefined;

  // 判断valuse是否数组

  let item;
  if (Array.isArray(value)) {
    item = value[columnIndex];
  } else {
    item = value.value;
  }

  // 取消子节点选中
  clearChildSelections(selectedDeptIds.value);

  // 根据选中的部门（item.value）动态设置后续列的数据
  updatePickerColumns(pickerView, item.value, columnIndex);

  resolve();
}

/**
 * 清除所有子节点选中的部门
 * @param selectedDeptIds - 当前所有已选中的部门ID
 */
function clearChildSelections(selectedDeptIds: number[]) {
  // 假设这里的部门数据是deptList，根据需要清除子节点选中的值
  selectedDeptIds.forEach((deptId) => {
    // 递归遍历部门列表，找到所有子节点并移除选中
    removeChildSelections(deptId, deptList);
  });
}

/**
 * 递归查找并移除选中状态的子节点
 * @param deptId - 当前选中的部门ID
 * @param deptList - 部门数据列表
 */
function removeChildSelections(deptId: number, deptList: Record<string, any>[]) {
  deptList.forEach((department) => {
    if (department.value == deptId && department.children) {
      // 如果当前部门有子节点，取消所有子节点的选中状态
      department.children.forEach((child: Record<string, any>) => {
        const index = selectedDeptIds.value.indexOf(child.value);
        if (index !== -1) {
          selectedDeptIds.value.splice(index, 1); // 从选中数组中移除
        }
      });
    }
    if (department.children) {
      // 递归处理子部门
      removeChildSelections(deptId, department.children);
    }
  });
}

/**
 * 动态更新所有后续列的数据
 * @param pickerView - PickerView 实例
 * @param parentId - 当前列选中的部门ID
 * @param columnIndex - 当前列索引
 */
function updatePickerColumns(
  pickerView: PickerViewInstance,
  parentId: string,
  columnIndex: number
) {
  console.log("updatePickerColumns", parentId, columnIndex);
  const nextColumnIndex = columnIndex + 1; // 下一列的索引
  const children = findDeptChildren(parentId, deptList); // 获取当前部门的子部门

  if (children.length > 0 && nextColumnIndex < 3) {
    // 更新下一列的部门数据
    pickerView.setColumnData(nextColumnIndex, children);

    // 递归更新下一列
    updatePickerColumns(pickerView, children[0].value, nextColumnIndex);
  }
}

/**
 * 根据部门ID查找其子部门
 * @param parentId - 父部门的ID
 * @param deptList - 部门数据列表
 * @returns - 子部门列表
 */
function findDeptChildren(
  parentId: string,
  deptList: Record<string, any>[]
): Record<string, any>[] {
  let children: Record<string, any>[] = [];

  // 遍历部门数据查找子部门
  deptList.forEach((department) => {
    if (department.value === parentId && department.children) {
      children = department.children;
    } else if (department.children) {
      children = children.concat(findDeptChildren(parentId, department.children)); // 递归查找
    }
  });

  return children;
}

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
 *  删除
 * @param id  用户id
 */
function handleDelete(id: number) {
  message
    .confirm({
      msg: "确认删除用户吗？",
      title: "提示",
    })
    .then(() => {
      console.log("点击了确定按钮");
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
  :deep(.wd-cell__wrapper) {
    padding: 8rpx 0;
  }

  :deep(.wd-cell) {
    padding-right: 10rpx;
    background: #f5f5f5;
  }
}
</style>
