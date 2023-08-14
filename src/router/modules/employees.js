import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [{
    path: '',
    name: 'Employees',
    component: () => import('@/views/employees/employees.vue'),
    meta: { title: '员工管理', icon: 'people' }
  }]
}
