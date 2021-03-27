import request from '@/utils/request';

export function getPermissions(params) {
  return request({
    url: '/permissions',
    method: 'get',
    params
  });
}

export function getPermisssionsNodes() {
  return request({
    url: '/permissions/node',
    method: 'get'
  });
}

export function getPermissionDispatch(params) {
  return request({
    url: '/permission/dispatch',
    method: 'get',
    params
  });
}

export function addPermission(data) {
  return request({
    url: '/permissions',
    method: 'post',
    data
  });
}

export function updatePermission(data, id) {
  return request({
    url: '/permissions/' + id,
    method: 'put',
    data
  });
}

export function deletePermission(id) {
  return request({
    url: '/permissions/' + id,
    method: 'delete'
  });
}
