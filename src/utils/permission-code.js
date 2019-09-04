import Cookies from 'js-cookie'

const PermissionCodeKey = 'vue_admin_template_permission_code'

export function getPermissonCodes() {
  return Cookies.get(PermissionCodeKey)
}

export function setPermissonCodes(permissonCodes) {
  return Cookies.set(PermissionCodeKey, permissonCodes)
}

export function removePermissonCodes() {
  return Cookies.remove(PermissionCodeKey)
}
