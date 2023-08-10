import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getProfile, getUserInfo } from '@/api/user'
import { Message } from 'element-ui'
export default {
  namespaced: true,
  state: {
    token: getToken() || null,
    userInfo: {}
  },
  mutations: {
    updateToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    },
    updatedUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    removeUserInfo(state, userInfo) {
      state.userInfo = ''
    }
  },
  actions: {
    // data表示接口参数
    async userLogin(context, obj) {
      console.log('action userLogin', context, obj)
      // 调用ajax请求去做登陆
      const res = await login(obj)
      console.log(res)
      // 在actions中，如果要修改state，还是要调用mutaions
      // context.commit('mutation名'， 参数)
      context.commit('updateToken', res.data)
      Message.success(res.message)
    },
    async userProfile(context) {
      const res = await getProfile()
      const res2 = await getUserInfo(res.data.userId)
      console.log(res)
      console.log(res2)
      context.commit('updatedUserInfo', { ...res.data, ...res2.data })
    },
    // 删除token
    logout(context) {
      context.commit('removeToken')
      context.commit('removeUserInfo')
    }
  }
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

