<template>
  <!-- // 分配角色 -->
  <div>
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSubmit">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getRoles } from '@/api/setting'
import { getUserInfo } from '@/api/user'
import { assignRoles } from '@/api/employess'
export default {
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [],
      roles: []
    }
  },
  created() {
    this.lodaRoles()
    this.lodaRolesById()
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    async lodaRoles() {
      const res = await getRoles({ page: 1, pagesize: 100 }).catch(e => e)
      if (!res.success) return
      // console.log(res)
      this.roles = res.data.rows
    },
    async lodaRolesById() {
      const res = await getUserInfo(this.userId).catch(e => e)
      if (!res.success) return
      // console.log(res)
      this.roleIds = res.data.roleIds
    },
    // 确定
    async hSubmit() {
      const res = await assignRoles({ id: this.userId, roleIds: this.roleIds }).catch(e => e)
      if (!res.success) return this.$message(res.message)
      this.$message.success(res.message)
      this.$emit('close')
    }
  }
}
</script>
