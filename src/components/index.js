import PageTools from './PageTools'
import UploadExcel from './UploadExcel'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)// 注册工具栏组件
    Vue.component(UploadExcel.name, UploadExcel) // 注册导入excel组件
  }
}

