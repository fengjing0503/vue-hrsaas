import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [{
    path: '',
    name: 'Employees',
    component: () => import('@/views/employees/employees.vue'),
    meta: { title: '员工管理', icon: 'people' }
  },
  {
    path: 'import',
    name: 'Import',
    component: () => import('@/views/employees/empimport'),
    hidden: true, // 不显示到左侧菜单
    meta: { title: 'excel导入', icon: 'dashboard' }

  }]
}
