<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"

      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else v-show="!showProgress" class="el-icon-plus avatar-uploader-icon" />
      <el-progress v-if="showProgress" type="circle" :width="158" :percentage="percent" class="progress" />
    </el-upload>
  </div>
</template>

<script>
// 下面的代码是固定写法
const COS = require('cos-js-sdk-v5')
// 填写自己腾讯云cos中的key和id (密钥)
const cos = new COS({
  SecretId: 'AKIDo8OYdbaQHzTnwwpfJuIRRJzTnOvHPJH3', // 身份识别ID
  SecretKey: 'ZzIWZO2hAPVOTN3YDi1EG9qKdrukQtCM' // 身份秘钥
})
export default {
  name: 'UploadImg',
  props: {
    // 从父组件传递过来的v-model对应的值
    value: { type: String, default: '' }
  },
  data() {
    return {
      // imageUrl: '',
      percent: 0, // 上传进度
      showProgress: false // 是否展示进度条
    }
  },
  methods: {
    upload(res) {
      // console.log(res.file)
      if (!res.file) return
      this.showProgress = true
      // this.imageUrl = ''
      this.$emit('input', '')
      // 执行上传操作
      cos.putObject({
        Bucket: 'hr-1316781621', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: res.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD', // 上传模式, 标准模式
        Body: res.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        console.log(err, data)
        // 上传成功之后
        if (data.statusCode === 200) {
          // this.imageUrl = `https:${data.Location}`
          this.$emit('input', `https:${data.Location}`)
          this.showProgress = false
        }
      })
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      this.$emit('input', URL.createObjectURL(file.raw))
    },
    beforeAvatarUpload(file) {
    //   const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      //   if (!isPNG) {
      //     this.$message.error('上传头像图片只能是 PNG 格式!')
      //   }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 158px;
    height: 158px;
    line-height: 158px;
    text-align: center;
}

.avatar {
    width: 158px;
    height: 158px;
    display: block;
}
</style>
