import { login, refreshToken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setPermissonCodes, removePermissonCodes } from '@/utils/permission-code'
import { getUserAvatar, setUserAvatar, removeUserAvatar, getUsername, setUsername, removeUsername } from '@/utils/user-info'
import { getIsSuperuser, setIsSuperuser, removeIsSuperuser } from '@/utils/user-info'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  is_superuser: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_IS_SUPERUSER: (state, is_superuser) => {
    var flag = true
    if (typeof is_superuser === 'string') {
      if (is_superuser === 'false') {
        flag = false
      }
    } else {
      flag = is_superuser
    }
    state.is_superuser = flag
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.username)
        commit('SET_AVATAR', data.avatar)
        commit('SET_IS_SUPERUSER', data.is_superuser)
        dispatch('permission/generatePermissionCodes', data.permission_codes, { root: true })
        setUsername(data.username)
        setUserAvatar(data.avatar)
        setToken(data.token)
        setIsSuperuser(data.is_superuser)
        setPermissonCodes(data.permission_codes)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeUserAvatar()
      removeUsername()
      removeToken()
      resetRouter()
      removePermissonCodes()
      removeIsSuperuser()
      resolve()
    })
  },

  // refresh token
  refreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      refreshToken({ token: getToken() }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.username)
        commit('SET_AVATAR', data.avatar)
        commit('SET_IS_SUPERUSER', data.is_superuser)
        setUsername(data.username)
        setUserAvatar(data.avatar)
        setToken(data.token)
        setIsSuperuser(data.is_superuser)
        setPermissonCodes(data.permission_codes)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // reset token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // reset token
  setUserInfo({ commit }) {
    return new Promise(resolve => {
      commit('SET_NAME', getUsername())
      commit('SET_AVATAR', getUserAvatar())
      commit('SET_IS_SUPERUSER', getIsSuperuser())
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

