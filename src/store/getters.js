const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  is_superuser: state => state.user.is_superuser,
  permission_routes: state => state.permission.routes,
  permission_codes: state => state.permission.permissionCodes
}
export default getters
