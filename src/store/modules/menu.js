import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    menuList: [...constantRoutes]
  },
  mutations: {
    setMenuList(state, asyncRoutes) {
      state.menuList = [...constantRoutes, ...asyncRoutes]
    }
  }
}
