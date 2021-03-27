import { asyncRoutes, constantRoutes } from '@/router'
import { getMenus } from '@/api/menu'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

function filterMenus(localMenus, remoteMenus) {
  const res = []
  localMenus.forEach(local => {
    remoteMenus.forEach(remote => {

      if (remote.path === local.path) {
        local.meta.title = remote.title
        local.meta.roles = remote.roleSlugs
        if (local.children && remote.children) {
          local.children = filterMenus(local.children, remote.children)
        }
        res.push(local)
      }
    })
  })
  return res
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      getMenus({
        parent_id: 0
      }).then(res => {
        const remoteRoutes = res.data
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(filterMenus(asyncRoutes, remoteRoutes), roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
