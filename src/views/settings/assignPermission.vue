<template>
  <div>
    <el-tree ref="refTree" node-key="id" check-strictly show-checkbox :data="list" :props="{label:'name'}" default-expand-all />

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSubmit">确定</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </div>
  </div>

</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import { assignPerm, getRoleDetail } from '@/api/setting'
export default {
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    // 调用接口，获取所有的权限点数据
    this.loadPermissionList()
    // 调用接口，获取当前这个角色已经具备的权限
    this.loadPermissionByRoleId()
  },
  methods: {
    async hSubmit() {
      const permIds = this.$refs.refTree.getCheckedKeys()
      //   console.log(permIds)
      const res = await assignPerm({ id: this.roleId, permIds: permIds }).catch(e => e)
      if (!res.success) return
      this.$message(res.message)
      this.$emit('close')
    //   console.log(res)
    },
    async loadPermissionList() {
      const res = await getPermissionList().catch(e => e)
      if (!res.success) return
      // console.log(res)
      this.list = tranListToTreeData(res.data)
    },
    async loadPermissionByRoleId() {
      const res = await getRoleDetail(this.roleId).catch(e => e)
      if (!res.success) return
      this.$refs.refTree.setCheckedKeys(res.data.permIds)
    }
  }
}
</script>

<style>

</style>
