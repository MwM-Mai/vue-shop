import { request } from "./request"

// 获取角色列表数据
export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}


// 查询角色信息
export function getRolesInfo(id) {
  return request({
    url: `roles/${id}`,
    method: 'get'
  })
}


// 添加角色信息
export function addRolesInfo(roleName, roleDesc) {
  return request({
    url: 'roles',
    data: {
      roleName,
      roleDesc
    },
    method: 'post'
  })
}

// 确认修改角色信息
export function editRolesInfo(id, roleName, roleDesc) {
  return request({
    url: `roles/${id}`,
    data: {
      roleName,
      roleDesc
    },
    method: "put"
  })
}


// 删除角色信息
export function deleteRolesInfo(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}


// 删除角色指定权限
export function deleteRolesPower(rolesId, rightId) {
  return request({
    url: `roles/${rolesId}/rights/${rightId}`,
    method: 'delete'
  })
}


// 获取说要权限数据
export function getAllpower() {
  return request({
    url: 'rights/tree',
    method: 'get'
  })
}


// 分配权限
export function rolesEmpower(id, rids) {
  return request({
    url: `roles/${id}/rights`,
    data: {
      rids
    },
    method: 'post'
  })
}