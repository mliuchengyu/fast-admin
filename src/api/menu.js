import request from '@/utils/request';

export function getMenus(params) {
  return request({
    url: '/menus',
    method: 'get',
    params: params
  });
}

export function addMenu(data) {
  return request({
    url: '/menus',
    method: 'post',
    data
  });
}

export function updateMenu(data, id) {
  return request({
    url: '/menus/' + id,
    method: 'put',
    data
  });
}

export function deleteMenu(id) {
  return request({
    url: '/menus/' + id,
    method: 'delete'
  });
}

export function getMenuNodes() {
  return request({
    url: '/menus/node',
    method: 'get'
  });
}
