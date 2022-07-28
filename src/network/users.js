import { request } from './request'

// 获取用户的数据
export function getUsersList(query, pagenum, pagesize) {
  return request({
    url: 'users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 修改用户状态请求
export function userStateChanged(userInfo) {
  return request({
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: 'put'
  })
}

// 添加新用户的请求
export function getNewuser(addFrom) {
  return request({
    url: 'users', 
    data: addFrom,
    method: 'post'
  })
}


// 获取用户的id
export function getUserId(id) {
  return request({
    url: `users/${id}`
  })
}


// 修改用户信息
export function editUserInfo(id, email, mobile) {
  return request({
    url: `users/${id}`,
    data: {
      email, 
      mobile
    },
    method: 'put'
  })
}

// 删除用户信息
export function deleteUserInfo(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 获取所有角色
export function getAllRoleInfo() {
  return request({
    url: 'roles',
    method: 'get'
  })
}

// 分配角色的请求
export function setRoleInfo(id, rid) {
  return request({
    url: `users/${id}/role`,
    data: {
      rid
    },
    method: 'put'
  })
}