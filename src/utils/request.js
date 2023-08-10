import axios from 'axios'
import store from '@/store'
import router from '@/router'
const service = axios.create({
  // http://ihrm-java.itheima.net
  // http://localhost:3000
  // baseURL: 'https://ihrm.itheima.net',
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 1000 // 超时时间
})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.data.success) {
    return response.data
  } else {
    // 抛出错误
    return Promise.reject(new Error(response.data.message))
  }
}, async function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.data.code === 10002) {
    console.log('token失效')
    // token失效,删除token
    await store.dispatch('user/logout')
    // 跳转登录页
    router.push({
      path: '/login',
      query: {
        // return_url: router.currentRoute.fullPath
        return_url: location.hash.substring(1)
      }
    })
  }
  return Promise.reject(error)
})

export default service

