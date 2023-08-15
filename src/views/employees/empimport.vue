<template>
  <div class="app-container" style="padding-top: 100px;">
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import { formatExcelDate } from '@/utils'
import { importEmployee } from '@/api/employess'
export default {
  name: 'Import',
  data() {
    return {
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      // header 标题
      //        ['姓名','手机号']
      // results excel表格的内容
      //        [ {'姓名'：'小张'， '手机号': '13712345678'}, {.....} ]

      //   excel读取成功了
      console.log(header, results)
      //   转换成后台可以读取的格式
      const data = this.transExcel(results)
      //   console.log(res)
      // 发给后台
      const res = await importEmployee(data).catch(e => e)
      //   console.log(res)
      //   请求失败
      if (!res.success) return this.$message.error(res.message)
      //   请求成功
      this.$message.success(res.message)
      //   返回上一级
      this.$router.back()
    },
    transExcel(results) {
      const mapInfo = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      const res = results.map(item => {
        const obj = {}
        const zhKeys = Object.keys(item) // 拿到对象的所有属性名,是一个数组
        // obj['姓名']=item['姓名']
        zhKeys.forEach(zhKey => {
          // 转中文
          const enKey = mapInfo[zhKey]
          //   时间转换
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            obj[enKey] = formatExcelDate(item[zhKey])
          } else {
            obj[enKey] = item[zhKey]
          }
        })
        return obj
      })
      return res
    }
  }
}
</script>
