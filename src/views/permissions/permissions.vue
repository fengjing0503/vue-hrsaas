<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="hAdd(1,'0')">添加权限</el-button>
        </div>
        <el-table :data="list" row-key="id" border>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type===1" type="text" @click="hAdd(2,row.id)">添加</el-button>
              <el-button type="text" @click="hEdit(row.id)">编辑</el-button>
              <el-button type="text" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog :visible.sync="showDialog" title="弹层标题" @close="resetForm(formData)">
      <!-- 表单内容 -->
      <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用" prop="enVisible">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="hSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    const validCode = (rule, value, callback) => {
      // 添加时的校验：code不能重复
      let existCodeList = this.originList
      if (this.isEdit) {
        // 编辑时的校验: code不能取自己
        existCodeList = this.originList.filter(item => item.id !== this.formData.id)
      }
      existCodeList.map(it => it.code).includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }

    const validName = (rule, value, callback) => {
      // 添加时的校验： 名字不能取子元素的名字
      let existNameList = this.originList.filter(item => item.pid === this.formData.pid)
      if (this.isEdit) {
        // 编辑时的校验： 名字不能取兄弟（排除自己）的名字
        // 找兄弟，排除自己
        existNameList = this.originList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id)
      }
      existNameList.map(it => it.name).includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }
    return {
      isEdit: false,
      list: [],
      showDialog: false, // 是否显示弹层
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      rules: {
        code: [{ message: '不能为空', required: true, trigger: 'blur' }, { validator: validCode, trigger: 'blur' }],
        name: [{ message: '不能为空', required: true, trigger: 'blur' }, { validator: validName, trigger: 'blur' }]
      },
      originList: [] // 在做校验时需要用到的数据
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    // 页面加载
    async loadPermissionList() {
      const res = await getPermissionList()
      // console.log(res.data)
      this.originList = res.data
      this.list = tranListToTreeData(res.data) // 转树形数据
    },
    // 添加
    hAdd(type, pid) {
      this.isEdit = false
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    // dialo确定
    hSubmit() {
      this.isEdit ? this.doEdit() : this.doAdd()
    },
    async doAdd() {
      const res = await addPermission(this.formData).catch(e => e) // 发请求
      if (!res.success) return this.$message.error(res.message) // 错误提醒
      this.$message.success(res.message) // 成功提醒
      this.showDialog = false // 关闭dialog
      this.$store.dispatch('user/postProfile') // 重新获取用户信息
      this.loadPermissionList() // 从新获取数据
    },
    // 当弹层关闭时，重置表单
    resetForm(formData) {
      // 1. 重置表单
      this.formData = {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
      // 2. 清空校验
      this.$refs.formData.resetFields()
    },
    async doDel(id) {
      try {
        const res = await delPermission(id)
        console.log(res)

        this.$store.dispatch('user/postProfile') // 重新获取用户信息
        this.loadPermissionList()

        this.$message.success('删除成功')
      } catch (err) {
        // console.log(err)
        this.$message.error('删除失败')
      }
    },
    // 用户点击删除
    hDel(id) {
      // alert(id)
      this.$confirm('你确定要删除吗？').then(() => {
        this.doDel(id)
      }).catch(() => {

      })
    },
    // 点击编辑
    async hEdit(id) {
      this.isEdit = true
      // 数据回显
      const res = await getPermissionDetail(id).catch(e => e)
      if (!res.success) return
      // console.log(res)
      this.formData = res.data
      this.showDialog = true
    },
    async doEdit() {
      const res = await updatePermission(this.formData).catch(e => e)
      if (!res.success) return this.$message.error(res.message)
      this.showDialog = false // 关闭dialog
      this.$store.dispatch('user/postProfile') // 重新获取用户信息

      this.loadPermissionList() // 从新获取数据
    }
  }
}
</script>
