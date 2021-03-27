import request from '@/utils/request';

export function getRoles(params) {
  return request({
    url: '/roles',
    method: 'get',
    params: params
  });
}

export function addRole(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  });
}
export function postRoleApply(data, id) {
  return request({
    url: '/roles/apply/' + id,
    method: 'post',
    data
  });
}
export function getRolesUsers(name) {
  return request({
    url: '/roles_users/' + name,
    method: 'get',
  });
}
export function updateRole(data, id) {
  return request({
    url: '/roles/' + id,
    method: 'put',
    data
  });
}

export function deleteRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete'
  });
}
