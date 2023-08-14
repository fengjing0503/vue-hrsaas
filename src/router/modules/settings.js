import Layout from '@/layout'

export default {
  path: '/settings',
  component: Layout,
  children: [{
    path: '',
    name: 'Settings',
    component: () => import('@/views/settings/settings.vue'),
    meta: { title: '公司设置', icon: 'settings' }
  }]
}
