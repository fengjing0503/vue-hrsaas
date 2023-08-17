import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  children: [{
    path: '',
    name: 'approvals',
    component: () => import('@/views/approvals/approvals.vue'),
    meta: { title: '审批管理', icon: 'tree-table' }
  }]
}
