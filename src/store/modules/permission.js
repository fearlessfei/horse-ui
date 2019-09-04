import { constantRoutes } from '@/router'
import { getRouter } from '@/api/user'
import { getPermissonCodes } from '@/utils/permission-code'

const state = {
  routes: [],
  addRoutes: [],
  permissionCodes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  REMOVE_ROUTES: (state) => {
    state.addRoutes = []
    state.routes = []
  },
  SET_PERMISSIONCODES: (state, permissionCodes) => {
    state.permissionCodes = permissionCodes
  }
}

function generateRoutesFromMenu(menuList = []) {
  menuList.forEach(route => {
    route.component = lazyLoading(route.component, 'layout')
    if (route.children && route.children.length > 0) {
      route.children = transferChildren(route.children)
    }
  })
  // 404 page must be placed at the end !!!
  menuList.push({ 'path': '*', 'redirect': '/404', 'hidden': true })
  return menuList
}

/**
 * Dynamic Load Routing
 * @param name
 * @param type
 */
function lazyLoading(name, type) {
  if (type === 'views') {
    return () => import(`@/views/${name}`)
  }
  return () => import(`@/layout/${name}`)
}

function transferChildren(childrenArr) {
  childrenArr.map((cur, index) => {
    const component = cur.component
    cur.component = lazyLoading(component, 'views')
    if (cur.children && cur.children.length > 0) {
      transferChildren(cur.children)
    }
  })
  return childrenArr
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getRouter().then(response => {
        const { data } = response
        const menuList = generateRoutesFromMenu(data)
        commit('SET_ROUTES', menuList)
        resolve(menuList)
      }).catch(error => {
        reject(error)
      })
    })
  },
  removeRoutes({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_ROUTES', '')
      resolve()
    })
  },
  generatePermissionCodes({ commit }, permissionCodes) {
    return new Promise(resolve => {
      commit('SET_PERMISSIONCODES', permissionCodes)
      resolve()
    })
  },
  setPermissionCodes({ commit }) {
    return new Promise(resolve => {
      commit('SET_PERMISSIONCODES', getPermissonCodes())
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
