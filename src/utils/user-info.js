import Cookies from 'js-cookie'

const UserAvatarKey = 'user_avatar'
const UsernameKey = 'username'
const IsSuperuserKey = 'is_superuser'

export function getUserAvatar() {
  return Cookies.get(UserAvatarKey)
}

export function setUserAvatar(avatar) {
  return Cookies.set(UserAvatarKey, avatar)
}

export function removeUserAvatar() {
  return Cookies.remove(UserAvatarKey)
}

export function getUsername() {
  return Cookies.get(UsernameKey)
}

export function setUsername(username) {
  return Cookies.set(UsernameKey, username)
}

export function removeUsername() {
  return Cookies.remove(UsernameKey)
}

export function getIsSuperuser() {
  return Cookies.get(IsSuperuserKey)
}

export function setIsSuperuser(is_superuser) {
  return Cookies.set(IsSuperuserKey, is_superuser)
}

export function removeIsSuperuser() {
  return Cookies.remove(IsSuperuserKey)
}
