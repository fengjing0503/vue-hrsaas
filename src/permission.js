import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from './router'
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'
const whiteList = ['/login', '/404']
// 全局前置路由守卫
//  to:  要去哪个页面
//  from:从哪里来
//  next:它是一个函数。
//     如果直接放行 next()
//     如果要跳到其它页 next(其它页)
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.state.user.token
  // 判断是否有token
  // 有token  判断是否去登录页,是跳转主页,否放行
  // 无token  判断是否去白名单,是跳转登录页,否放行
  if (token) {
    // 已登录  跳转前拿到用户信息
    // 可以不加await
    // 必须拿到用户信息才可以进入首页,否则进不去
    // 可以避免出现token过期依然进入首页闪回登录页,优化用户体验
    // 进入首页后一定可以拿到用户信息

    // 加判断 如果有userId,就不需要发请求了,没有才发
    const userId = store.getters.userId
    if (userId) {
      await store.dispatch('user/userProfile')
    }
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 判断没有Token要去的地址在不在白名单   如果在就放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
  NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
