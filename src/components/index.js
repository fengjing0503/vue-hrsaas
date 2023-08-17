import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from '@/components/UploadImg'
import ImageHolder from '@/components/ImageHolder'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)// 注册工具栏组件
    Vue.component(UploadExcel.name, UploadExcel) // 注册导入excel组件
    Vue.component(UploadImg.name, UploadImg) // 注册上传图片组件
    Vue.component(ImageHolder.name, ImageHolder)
  }
}

